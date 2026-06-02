import { ComponentType, Suspense, lazy, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

const previewByCategory: Record<
  string,
  {
    label: string;
    modules: Record<string, () => Promise<unknown>>;
    getPath: (level: number) => string;
  }
> = {
  [ACERTIJOS]: {
    label: "Adivinanzas",
    modules: import.meta.glob("../components/SVG/Adivinanzas/adivinanzas*.js"),
    getPath: (level) => `../components/SVG/Adivinanzas/adivinanzas${level}.js`,
  },
  [PELICULAS]: {
    label: "Peliculas",
    modules: import.meta.glob("../components/SVG/Peliculas/peliculas*.js"),
    getPath: (level) => `../components/SVG/Peliculas/peliculas${level}.js`,
  },
  [LOGOS]: {
    label: "Logos",
    modules: import.meta.glob("../components/SVG/Logos/marcas*.js"),
    getPath: (level) => `../components/SVG/Logos/marcas${level}.js`,
  },
  [EMOJIS]: {
    label: "Emojis",
    modules: import.meta.glob("../components/SVG/Emojis/emojis*.js"),
    getPath: (level) => `../components/SVG/Emojis/emojis${level}.js`,
  },
  [SOMBRAS]: {
    label: "Sombras",
    modules: import.meta.glob("../components/SVG/Sombras/sombras*.js"),
    getPath: (level) => `../components/SVG/Sombras/sombras${level}.js`,
  },
  [FUNKOS]: {
    label: "Funkos",
    modules: import.meta.glob("../components/SVG/Funkos/funkos*.js"),
    getPath: (level) => `../components/SVG/Funkos/funkos${level}.js`,
  },
  [ESCUDOS]: {
    label: "Escudos",
    modules: import.meta.glob("../components/SVG/Escudos/escudos*.js"),
    getPath: (level) => `../components/SVG/Escudos/escudos${level}.js`,
  },
  [BANDERAS]: {
    label: "Banderas",
    modules: import.meta.glob("../components/SVG/Banderas/banderas*.js"),
    getPath: (level) => `../components/SVG/Banderas/banderas${level}.js`,
  },
  [ALEATORIO]: {
    label: "Aleatorio",
    modules: import.meta.glob("../components/SVG/Wuzzles/wuzzles*.js"),
    getPath: (level) => `../components/SVG/Wuzzles/wuzzles${level}.js`,
  },
};

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedChip, setSelectedChip] = useState<string>(ACERTIJOS);

  const lastPlayedAt = localStorage.getItem(LAST_PLAYED_AT_KEY);
  const hasPlayedBefore = Boolean(lastPlayedAt);

  const inactivityDays = (() => {
    if (!lastPlayedAt) return 0;
    const lastPlayedDate = new Date(lastPlayedAt);
    if (Number.isNaN(lastPlayedDate.getTime())) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - lastPlayedDate.getTime()) / msPerDay);
  })();

  const greetingMessage =
    hasPlayedBefore && inactivityDays > 1
      ? `${t.goodMorning}, ${t.daysWithoutTrainingMessage.replace("{{days}}", String(inactivityDays))}`
      : t.goodMorning;

  const previewConfig = previewByCategory[selectedChip] ?? previewByCategory[ACERTIJOS];
  const previewLevel = 1;
  const maxLevel = Math.max(1, Object.keys(previewConfig.modules).length);
  const categoryLabel = previewConfig.label;
  const levelProgressText = `${previewLevel} de ${maxLevel}`;

  const modulePath = previewConfig.getPath(previewLevel);
  const moduleLoader =
    previewConfig.modules[modulePath] ?? Object.values(previewConfig.modules)[0];
  const PreviewSvg = useMemo(() => {
    if (!moduleLoader) return null;
    return lazy(moduleLoader as () => Promise<{ default: ComponentType }>);
  }, [moduleLoader]);

  const categoryLabels: Record<string, string> = {
    [ACERTIJOS]: "ACERTIJOS",
    [PELICULAS]: "PELICULAS",
    [SOMBRAS]: "SOMBRAS",
    [FUNKOS]: "FUNKOS",
    [ESCUDOS]: "ESCUDOS",
    [BANDERAS]: "BANDERAS",
    [ALEATORIO]: "ALEATORIO",
    [EMOJIS]: "EMOJIS",
    [LOGOS]: "LOGOS",
  };

  const cardPreviewByCategory = useMemo(() => {
    const entries = allCategories.map((key) => {
      const config = previewByCategory[key];
      const firstPath = config.getPath(1);
      const loader = config.modules[firstPath] ?? Object.values(config.modules)[0];

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
  }, []);

  const categoryCards = allCategories.map((key) => ({
    key,
    preview: cardPreviewByCategory[key],
    level: "NIV 1",
  }));

  return (
    <Layout showFooter={false}>
      {/* Language Selector */}
      <LanguageSelector />

      {/* TODO: Cambiar por el nombre de tu juego */}
      <Typography
        variant="h1"
        sx={{
          color: "#fff",
          fontWeight: 700,
          letterSpacing: "2px",
          fontFamily: "Lobster, cursive",
          width: "100%",
          textAlign: "center",
          px: 2,
          mb: 1,
          fontSize: { xs: "4.2rem", sm: "5.3rem", md: "6.2rem" },
          lineHeight: 0.95,
        }}
      >
        {t.appTitle}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
          fontStyle: "italic",
          letterSpacing: "2px",
          width: "calc(100% - 32px)",
          maxWidth: 400,
          textAlign: "center",
          mt: 0.5,
          mb: 2,
          fontSize: { xs: 18, md: 22 },
          lineHeight: 1.1,
        }}
      >
        {t.tagline}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: "rgba(255, 255, 255, 0.72)",
          fontWeight: 700,
          width: "calc(100% - 32px)",
          maxWidth: 400,
          textAlign: "left",
          mt: 1.5,
          fontSize: { xs: 18, md: 24 },
          lineHeight: 1.15,
        }}
      >
        {greetingMessage}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "#fff",
          fontWeight: 700,
          width: "calc(100% - 32px)",
          maxWidth: 400,
          textAlign: "left",
          mt: 1,
          mb: 2.5,
          fontSize: { xs: 24, sm: 32, md: 32 },
          lineHeight: 1.05,
          letterSpacing: "-0.5px",
        }}
      >
        {t.whatPlayToday}
      </Typography>

      <Box
        sx={{
          width: "calc(100% - 32px)",
          maxWidth: 400,
          borderRadius: { xs: 7, md: 7 },
          backgroundColor: "#ef7063",
          minHeight: { xs: 380, md: 460 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 1.75, md: 2.5 },
          mb: 2.5,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box
          sx={{
            mt: 0.5,
            mb: 1,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            width: "100%",
            height: { xs: 300, md: 330 },
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
            mt: { xs: 0.5, md: 1.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/levels")}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 999,
              backgroundColor: "#fff",
              color: "#c93d2f",
              width: { xs: "50%", md: "42%" },
              minWidth: { xs: 140, md: 200 },
              px: { xs: 2.5, md: 4 },
              py: { xs: 0.9, md: 1.2 },
              fontWeight: 700,
              fontSize: { xs: 20, md: 30 },
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#fff5f3",
                boxShadow: "none",
              },
            }}
          >
            Jugar
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
          px: 2,
          pt: 2,
          pb: 3,
          mt: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.75,
          }}
        >
          <Typography
            sx={{
              color: "#1f2025",
              fontWeight: 700,
              fontSize: { xs: 18, md: 28 },
              letterSpacing: "1px",
            }}
          >
            CATEGORIAS
          </Typography>
        </Box>

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
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 1.25,
          }}
        >
          {categoryCards.map((card) => (
            <Box
              key={card.key}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#fff",
                border: "1px solid #e3e3e3",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

    </Layout>
  );
}
