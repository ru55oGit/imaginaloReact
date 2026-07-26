import {
  ComponentType,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import {
  ACERTIJOS,
  ALEATORIO,
  BANDERAS,
  EMOJIS,
  ESCUDOS,
  FUNKOS,
  LOGOS,
  PELICULAS,
  SOMBRAS,
} from "../constanst/categories.js";
import { LAST_PLAYED_AT_KEY } from "../levels/levelsData";
import aleatoriosData from "../data/aleatorios.json";
import aleatoriosEnData from "../data/aleatorios_en.json";
import aleatoriosSpData from "../data/aleatorios_sp.json";

const allCategories = [
  ACERTIJOS,
  PELICULAS,
  LOGOS,
  EMOJIS,
  SOMBRAS,
  FUNKOS,
  ESCUDOS,
  BANDERAS,
  ALEATORIO,
] as const;

const adivinanzasModules = import.meta.glob(
  "../components/SVG/Adivinanzas/adivinanzas*.js",
);
const wuzzlesModules = import.meta.glob("../components/SVG/Wuzzles/wuzzles*.js");
const jugadoresModules = import.meta.glob(
  "../components/SVG/Jugadores/jugadores*.js",
);

type RandomEntry = {
  categoria?: string;
  pregunta?: string;
};

const JUGADORES = "jugadores";
const WUZZLES = "wuzzles";

const previewByCategory: Record<
  string,
  {
    modules: Record<string, () => Promise<unknown>>;
    getPath: (level: number) => string;
  }
> = {
  [ACERTIJOS]: {
    modules: adivinanzasModules,
    getPath: (level) => `../components/SVG/Adivinanzas/adivinanzas${level}.js`,
  },
  [PELICULAS]: {
    modules: import.meta.glob("../components/SVG/Peliculas/peliculas*.js"),
    getPath: (level) => `../components/SVG/Peliculas/peliculas${level}.js`,
  },
  [LOGOS]: {
    modules: import.meta.glob("../components/SVG/Logos/marcas*.js"),
    getPath: (level) => `../components/SVG/Logos/marcas${level}.js`,
  },
  [EMOJIS]: {
    modules: import.meta.glob("../components/SVG/Emojis/emojis*.js"),
    getPath: (level) => `../components/SVG/Emojis/emojis${level}.js`,
  },
  [SOMBRAS]: {
    modules: import.meta.glob("../components/SVG/Sombras/sombras*.js"),
    getPath: (level) => `../components/SVG/Sombras/sombras${level}.js`,
  },
  [FUNKOS]: {
    modules: import.meta.glob("../components/SVG/Funkos/funkos*.js"),
    getPath: (level) => `../components/SVG/Funkos/funkos${level}.js`,
  },
  [ESCUDOS]: {
    modules: import.meta.glob("../components/SVG/Escudos/escudos*.js"),
    getPath: (level) => `../components/SVG/Escudos/escudos${level}.js`,
  },
  [BANDERAS]: {
    modules: import.meta.glob("../components/SVG/Banderas/banderas*.js"),
    getPath: (level) => `../components/SVG/Banderas/banderas${level}.js`,
  },
  [JUGADORES]: {
    modules: jugadoresModules,
    getPath: (level) => `../components/SVG/Jugadores/jugadores${level}.js`,
  },
  [ALEATORIO]: {
    modules: wuzzlesModules,
    getPath: (level) => `../components/SVG/Wuzzles/wuzzles${level}.js`,
  },
  [WUZZLES]: {
    modules: wuzzlesModules,
    getPath: (level) => `../components/SVG/Wuzzles/wuzzles${level}.js`,
  },
};

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [selectedChip, setSelectedChip] = useState<string>(ACERTIJOS);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>(
    {},
  );

  const lastPlayedAt = localStorage.getItem(LAST_PLAYED_AT_KEY);
  const hasPlayedBefore = Boolean(lastPlayedAt);

  const inactivityDays = (() => {
    if (!lastPlayedAt) return 0;
    const lastPlayedDate = new Date(lastPlayedAt);
    if (Number.isNaN(lastPlayedDate.getTime())) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - lastPlayedDate.getTime()) / msPerDay);
  })();

  const nowHour = new Date().getHours();
  const timeGreeting = nowHour < 12 ? t.goodMorning : nowHour < 20 ? t.goodAfternoon : t.goodEvening;
  const greetingMessage =
    hasPlayedBefore && inactivityDays > 1
      ? `${timeGreeting}, ${t.daysWithoutTrainingMessage.replace("{{days}}", String(inactivityDays))}`
      : timeGreeting;

  const getPreviewConfigByLanguage = (category: string) => {
    // In English, riddles use Wuzzles assets.
    if (category === ACERTIJOS && currentLanguage === "en") {
      return {
        ...previewByCategory[ACERTIJOS],
        modules: previewByCategory[ALEATORIO].modules,
        getPath: previewByCategory[ALEATORIO].getPath,
      };
    }

    return previewByCategory[category] ?? previewByCategory[ACERTIJOS];
  };

  const getProgressStorageKey = (category: string) => {
    const effectiveCategory =
      category === ACERTIJOS && currentLanguage === "en"
        ? ALEATORIO
        : category;

    return `imaginalo_progress_${effectiveCategory}_${currentLanguage}`;
  };

  const randomEntries = useMemo<RandomEntry[]>(() => {
    if (currentLanguage === "en") {
      return (aleatoriosEnData as { preguntas?: RandomEntry[] }).preguntas ?? [];
    }

    if (currentLanguage === "es_sp") {
      return (aleatoriosSpData as { preguntas?: RandomEntry[] }).preguntas ?? [];
    }

    return (aleatoriosData as { preguntas?: RandomEntry[] }).preguntas ?? [];
  }, [currentLanguage]);

  const getCategoryMaxLevel = (category: string): number => {
    if (category === ALEATORIO) {
      return Math.max(1, randomEntries.length);
    }

    const config = getPreviewConfigByLanguage(category);
    return Math.max(1, Object.keys(config.modules).length);
  };

  const parseLevelNumber = (value?: string): number | null => {
    const parsed = Number.parseInt((value ?? "").trim(), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const resolveRandomCategory = (value?: string): string => {
    const normalized = (value ?? "").trim().toLowerCase();

    if (!normalized) return ALEATORIO;
    if (normalized === WUZZLES) return WUZZLES;

    if (normalized in previewByCategory) {
      return normalized;
    }

    return ALEATORIO;
  };

  const getModuleLoaderForCategoryLevel = (category: string, level: number) => {
    if (category === ALEATORIO) {
      const maxLevel = getCategoryMaxLevel(ALEATORIO);
      const safeLevel = Math.min(Math.max(level, 1), maxLevel);
      const entry = randomEntries[safeLevel - 1];
      const randomCategory = resolveRandomCategory(entry?.categoria);
      const randomLevel = parseLevelNumber(entry?.pregunta) ?? 1;
      const randomConfig =
        previewByCategory[randomCategory] ?? previewByCategory[ACERTIJOS];
      const randomPath = randomConfig.getPath(randomLevel);

      return {
        loader:
          randomConfig.modules[randomPath] ??
          Object.values(randomConfig.modules)[randomLevel - 1] ??
          Object.values(randomConfig.modules)[0],
        maxLevel,
      };
    }

    const config = getPreviewConfigByLanguage(category);
    const maxLevel = Math.max(1, Object.keys(config.modules).length);
    const safeLevel = Math.min(Math.max(level, 1), maxLevel);
    const path = config.getPath(safeLevel);

    return {
      loader: config.modules[path] ?? Object.values(config.modules)[0],
      maxLevel,
    };
  };

  const readProgressByCategory = useCallback(() => {
    const nextProgress: Record<string, number> = {};

    allCategories.forEach((category) => {
      const maxLevel = getCategoryMaxLevel(category);
      const stored = parseInt(
        localStorage.getItem(getProgressStorageKey(category)) || "1",
        10,
      );
      const safeLevel = Number.isFinite(stored)
        ? Math.min(Math.max(stored, 1), maxLevel)
        : 1;

      nextProgress[category] = safeLevel;
    });

    setCategoryProgress(nextProgress);
  }, [currentLanguage, randomEntries]);

  useEffect(() => {
    const handleProgressUpdated = () => readProgressByCategory();
    const handleLanguageChanged = () => readProgressByCategory();

    const handleFocus = () => readProgressByCategory();

    readProgressByCategory();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("imaginalo:progress-updated", handleProgressUpdated);
    window.addEventListener("imaginalo:language-changed", handleLanguageChanged);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener(
        "imaginalo:progress-updated",
        handleProgressUpdated,
      );
      window.removeEventListener(
        "imaginalo:language-changed",
        handleLanguageChanged,
      );
    };
  }, [readProgressByCategory]);

  const previewLevel = categoryProgress[selectedChip] ?? 1;
  const selectedModule = getModuleLoaderForCategoryLevel(selectedChip, previewLevel);
  const maxLevel = selectedModule.maxLevel;
  const categoryLabels: Record<string, string> = {
    [ACERTIJOS]: t.categoryRiddles,
    [PELICULAS]: t.categoryMovies,
    [SOMBRAS]: t.categoryShadows,
    [FUNKOS]: t.categoryFunkos,
    [ESCUDOS]: t.categoryShields,
    [BANDERAS]: t.categoryFlags,
    [ALEATORIO]: t.categoryRandom,
    [EMOJIS]: t.categoryEmojis,
    [LOGOS]: t.categoryLogos,
  };
  const categoryLabel = categoryLabels[selectedChip] ?? t.categoryRiddles;
  const levelProgressText = `${previewLevel} ${t.ofWord} ${maxLevel}`;

  const moduleLoader = selectedModule.loader;
  const PreviewSvg = useMemo(() => {
    if (!moduleLoader) return null;
    return lazy(moduleLoader as () => Promise<{ default: ComponentType }>);
  }, [moduleLoader]);

  const cardPreviewByCategory = useMemo(() => {
    const entries = allCategories.map((key) => {
      const level = categoryProgress[key] ?? 1;
      const loader = getModuleLoaderForCategoryLevel(key, level).loader;

      if (!loader) return [key, null] as const;

      return [
        key,
        lazy(loader as () => Promise<{ default: ComponentType }>),
      ] as const;
    });

    return Object.fromEntries(entries) as Record<
      string,
      ReturnType<typeof lazy> | null
    >;
  }, [categoryProgress, currentLanguage, randomEntries]);

  const categoryCards = allCategories.map((key) => ({
    key,
    preview: cardPreviewByCategory[key],
    level: `${t.levelShort} ${categoryProgress[key] ?? 1}`,
  }));

  return (
    <Layout showFooter={false}>
      <Box
        sx={{
          width: "100%",
          px: { xs: 1.5, md: 2 },
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LanguageSelector />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "1px",
              fontFamily: "Lobster, cursive",
              textAlign: "center",
              width: "100%",
            }}
          >
            {t.appTitle}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.64)",
              fontStyle: "italic",
              letterSpacing: "2px",
              width: "100%",
              textAlign: "center",
              fontSize: { xs: 18, md: 22 },
            }}
          >
            {t.tagline}
          </Typography>
        </Box>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>
          {greetingMessage}
        </Typography>

        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>
          {t.whatPlayToday}
        </Typography>

        <Box
          sx={{
            width: "100%",
            borderRadius: "24px",
            backgroundColor: "#ef7063",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
          }}
        >
          <Box
            sx={{
              mb: 2,
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#ffffff",
              width: "100%",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                width: "100%",
                height: "100%",
              },
            }}
          >
            {PreviewSvg ? (
              <Suspense fallback={<Box sx={{ width: "100%", height: "100%" }} />}>
                <PreviewSvg />
              </Suspense>
            ) : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/levels", { state: { category: selectedChip } })}
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: "28px !important" }} />}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 999,
                backgroundColor: "#fff",
                color: "#c93d2f",
                px: 3,
                py: 1.4,
                fontWeight: 800,
                fontSize: 18,
                textTransform: "none",
                boxShadow: "0 0 0 4px rgba(255,255,255,0.35), 0 10px 24px rgba(0,0,0,0.4)",
                "&:hover": {
                  backgroundColor: "#fff5f3",
                  boxShadow: "0 0 0 4px rgba(255,255,255,0.5), 0 12px 26px rgba(0,0,0,0.45)",
                },
              }}
            >
              {t.playButton}
            </Button>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                textAlign: "right",
                color: "#fff",
                pr: { xs: 0.5, md: 1.5 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 14, md: 18 },
                  lineHeight: 1.1,
                }}
              >
                {categoryLabel}
              </Typography>
              <Typography
                sx={{
                  opacity: 0.9,
                  fontWeight: 600,
                  fontSize: { xs: 13, md: 16 },
                  lineHeight: 1.2,
                }}
              >
                {levelProgressText}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            backgroundColor: "#f2f1f1",
            borderRadius: 4,
            px: 2,
            pt: 2,
            pb: 3,
          }}
        >
          <Typography
            sx={{
              color: "#1f2025",
              fontWeight: 700,
              fontSize: { xs: 18, md: 28 },
              letterSpacing: "1px",
              mb: 1.75,
            }}
          >
            {t.categoriesTitle}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 1,
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              pb: 0.5,
              mb: 1.75,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {allCategories.map((tab) => (
              <Box
                key={tab}
                onClick={() => setSelectedChip(tab)}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                  border: "1px solid #d0d0d0",
                  backgroundColor: selectedChip === tab ? "#cb3d2b" : "#f9f9f9",
                  color: selectedChip === tab ? "#fff" : "#3a3a3f",
                  fontWeight: 500,
                  fontSize: { xs: 18, md: 22 },
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {categoryLabels[tab]}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1.25,
            }}
          >
            {categoryCards.map((card) => (
              <Box
                key={card.key}
                onClick={() => navigate("/levels", { state: { category: card.key } })}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate("/levels", { state: { category: card.key } });
                  }
                }}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  border: "1px solid #e3e3e3",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    height: { xs: 90, md: 130 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    "& svg": {
                      width: "100%",
                      height: "100%",
                    },
                  }}
                >
                  {card.preview ? (
                    <Suspense fallback={<Box sx={{ width: "100%", height: "100%" }} />}>
                      <card.preview />
                    </Suspense>
                  ) : null}
                </Box>
                <Box sx={{ px: 1, py: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#313236",
                      fontSize: { xs: 14, md: 20 },
                      lineHeight: 1.1,
                    }}
                  >
                    {categoryLabels[card.key]}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#a0a0a4",
                      fontWeight: 600,
                      mt: 0.35,
                      fontSize: { xs: 14, md: 18 },
                      lineHeight: 1.1,
                    }}
                  >
                    {card.level}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#6b6b70",
                      fontWeight: 400,
                      mt: 0.5,
                      fontSize: { xs: 12, md: 14 },
                      lineHeight: 1.35,
                    }}
                  >
                    {t.categoryDescriptions[card.key]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.aboutTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            {t.aboutText}
          </Typography>
        </Box>

        <Box component="section" sx={{ backgroundColor: "rgba(0,0,0,0.18)", borderRadius: "24px", px: 2, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
            {t.howToPlayTitle}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            {t.howToPlayText}
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
