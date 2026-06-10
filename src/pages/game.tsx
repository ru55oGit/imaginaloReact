import React, {
  ComponentType,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Hypher from "hypher";
import spanishHyphenation from "hyphenation.es";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { LAST_PLAYED_AT_KEY, LAST_PLAYED_CATEGORY_KEY } from "../levels/levelsData";
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
  QUESTIONS,
  SOMBRAS,
} from "../constanst/categories.js";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { normalizeText } from "../utils/textNormalization";

import adivinanzasData from "../data/adivinanzas.json";
import peliculasData from "../data/peliculas.json";
import peliculasEnData from "../data/peliculas_en.json";
import peliculasSpData from "../data/peliculas_sp.json";
import marcasData from "../data/marcas.json";
import emojisData from "../data/emojis.json";
import emojisEnData from "../data/emojis_en.json";
import emojisSpData from "../data/emojis_sp.json";
import sombrasData from "../data/sombras.json";
import sombrasEnData from "../data/sombras_en.json";
import sombrasSpData from "../data/sombras_sp.json";
import funkosData from "../data/funkos.json";
import funkosEnData from "../data/funkos_en.json";
import funkosSpData from "../data/funkos_sp.json";
import escudosData from "../data/escudos.json";
import banderasData from "../data/banderas.json";
import banderasEnData from "../data/banderas_en.json";
import aleatoriosData from "../data/aleatorios.json";
import aleatoriosEnData from "../data/aleatorios_en.json";
import aleatoriosSpData from "../data/aleatorios_sp.json";
import wuzzlesData from "../data/wuzzles.json";

interface LocationState {
  level?: number;
  category?: string;
}

interface DataEntry {
  categoria?: string;
  pregunta?: string;
  titulo?: string;
  respuesta?: string;
}

const JUGADORES = "jugadores";
const WUZZLES = "wuzzles";

interface DataCollection {
  listado?: DataEntry[];
  preguntas?: DataEntry[];
}

const LEVEL_COUNT_BY_CATEGORY: Record<string, number> = {
  [ACERTIJOS]: 264,
  [PELICULAS]: 184,
  [LOGOS]: 100,
  [EMOJIS]: 129,
  [SOMBRAS]: 172,
  [FUNKOS]: 100,
  [ESCUDOS]: 100,
  [BANDERAS]: 100,
  [ALEATORIO]: 120,
};

const svgByCategory: Record<
  string,
  {
    modules: Record<string, () => Promise<unknown>>;
    getPath: (level: number) => string;
  }
> = {
  [ACERTIJOS]: {
    modules: import.meta.glob("../components/SVG/Adivinanzas/adivinanzas*.js"),
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
    modules: import.meta.glob("../components/SVG/Jugadores/jugadores*.js"),
    getPath: (level) => `../components/SVG/Jugadores/jugadores${level}.js`,
  },
  [ALEATORIO]: {
    modules: import.meta.glob("../components/SVG/Wuzzles/wuzzles*.js"),
    getPath: (level) => `../components/SVG/Wuzzles/wuzzles${level}.js`,
  },
  [WUZZLES]: {
    modules: import.meta.glob("../components/SVG/Wuzzles/wuzzles*.js"),
    getPath: (level) => `../components/SVG/Wuzzles/wuzzles${level}.js`,
  },
};

const isGuessableChar = (char: string): boolean => /[\p{L}\p{N}]/u.test(char);

const ANSWER_TILE_SIZE_PX = 26;
const ANSWER_TILE_GAP_PX = 4;
const ANSWER_CONTAINER_HORIZONTAL_PADDING_PX = 32;
const MIN_CHARS_PER_ROW = 6;

const FAIL_TIMER_SECONDS = 5 * 60;

const ADSENSE_CLIENT = "ca-pub-6825837607163963";
// Slot ID del bloque de Display que creaste en AdSense → Por bloque de anuncios → Anuncios de display
const ADSENSE_DISPLAY_SLOT = "5173463876";
// Slot ID de recompensa (futuro, cuando tengas Ad Manager)
const ADSENSE_REWARDED_SLOT = "REPLACE_WITH_YOUR_REWARDED_SLOT_ID";

const formatFailTimer = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type AnswerRenderToken =
  | { kind: "char"; charIndex: number }
  | { kind: "hyphen"; key: string };

const isLetterChar = (char: string): boolean => /[\p{L}]/u.test(char);
const isVowelChar = (char: string): boolean => /[aeiouáéíóúü]/i.test(char);
const spanishHypher = new Hypher(spanishHyphenation as Record<string, unknown>);

const getRecommendedBreakPoint = (
  chars: string[],
  maxChunkLength: number,
): number => {
  const safeMax = Math.max(2, Math.min(maxChunkLength, chars.length - 1));
  const preferredMin = Math.max(2, safeMax - 3);

  for (let index = safeMax; index >= preferredMin; index -= 1) {
    const prev = chars[index - 1];
    const next = chars[index];

    if (!prev || !next) continue;
    if (!isLetterChar(prev) || !isLetterChar(next)) continue;

    const prevIsVowel = isVowelChar(prev);
    const nextIsVowel = isVowelChar(next);

    if (prevIsVowel !== nextIsVowel || (prevIsVowel && nextIsVowel)) {
      return index;
    }
  }

  return safeMax;
};

const getSyllableBreakPoint = (
  word: string,
  maxChunkLength: number,
): number | null => {
  if (!word || maxChunkLength < 2 || word.length <= 2) {
    return null;
  }

  const safeMax = Math.max(2, Math.min(maxChunkLength, word.length - 1));
  if (safeMax < 2) {
    return null;
  }

  const syllables = spanishHypher.hyphenate(word);
  if (!Array.isArray(syllables) || syllables.length <= 1) {
    return null;
  }

  const breakpoints: number[] = [];
  let consumedLength = 0;

  syllables.slice(0, -1).forEach((syllable) => {
    consumedLength += syllable.length;
    breakpoints.push(consumedLength);
  });

  const strongCandidates = breakpoints.filter(
    (point) => point >= 2 && point <= safeMax && word.length - point >= 2,
  );

  if (strongCandidates.length > 0) {
    return strongCandidates[strongCandidates.length - 1];
  }

  const weakCandidates = breakpoints.filter(
    (point) => point >= 2 && point <= safeMax,
  );

  if (weakCandidates.length > 0) {
    return weakCandidates[weakCandidates.length - 1];
  }

  return null;
};

const getEntries = (source: DataCollection): DataEntry[] =>
  source.listado ?? source.preguntas ?? [];

const getEffectiveCategory = (category: string, language: string): string => {
  if (category === ACERTIJOS && language === "en") {
    return ALEATORIO;
  }

  return category;
};

const getProgressStorageKey = (category: string, language: string): string => {
  const effectiveCategory = getEffectiveCategory(category, language);
  return `imaginalo_progress_${effectiveCategory}_${language}`;
};

const getEntriesByCategoryAndLanguage = (
  category: string,
  language: string,
): DataEntry[] => {
  const pickEntries = (
    latam: DataCollection,
    en?: DataCollection,
    sp?: DataCollection,
  ): DataEntry[] => {
    if (language === "en") {
      const enEntries = en ? getEntries(en) : [];
      return enEntries.length > 0 ? enEntries : getEntries(latam);
    }

    if (language === "es_sp") {
      const spEntries = sp ? getEntries(sp) : [];
      return spEntries.length > 0 ? spEntries : getEntries(latam);
    }

    return getEntries(latam);
  };

  switch (category) {
    case ACERTIJOS:
      return language === "en"
        ? getEntries(wuzzlesData as DataCollection)
        : getEntries(adivinanzasData as DataCollection);
    case PELICULAS:
      return pickEntries(
        peliculasData as DataCollection,
        peliculasEnData as DataCollection,
        peliculasSpData as DataCollection,
      );
    case EMOJIS:
      return pickEntries(
        emojisData as DataCollection,
        emojisEnData as DataCollection,
        emojisSpData as DataCollection,
      );
    case SOMBRAS:
      return pickEntries(
        sombrasData as DataCollection,
        sombrasEnData as DataCollection,
        sombrasSpData as DataCollection,
      );
    case FUNKOS:
      return pickEntries(
        funkosData as DataCollection,
        funkosEnData as DataCollection,
        funkosSpData as DataCollection,
      );
    case ESCUDOS:
      return getEntries(escudosData as DataCollection);
    case BANDERAS:
      return pickEntries(
        banderasData as DataCollection,
        banderasEnData as DataCollection,
      );
    case LOGOS:
      return getEntries(marcasData as DataCollection);
    case ALEATORIO:
      return pickEntries(
        aleatoriosData as DataCollection,
        aleatoriosEnData as DataCollection,
        aleatoriosSpData as DataCollection,
      );
    default:
      return getEntries(adivinanzasData as DataCollection);
  }
};

const parseLevelNumber = (value?: string): number | null => {
  const parsed = Number.parseInt((value ?? "").trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const resolveRandomImageCategory = (value?: string): string => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (!normalized) return ALEATORIO;
  if (normalized === WUZZLES) return WUZZLES;

  if (normalized in svgByCategory) {
    return normalized;
  }

  return ALEATORIO;
};

const Game: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  const state = location.state as LocationState;
  const category = state?.category ?? ACERTIJOS;
  const level = Math.max(1, state?.level ?? 1);
  const effectiveCategory = getEffectiveCategory(category, currentLanguage);
  const totalLevels = LEVEL_COUNT_BY_CATEGORY[effectiveCategory] ?? 1;
  const progressStorageKey = getProgressStorageKey(category, currentLanguage);

  const entries = useMemo(
    () => getEntriesByCategoryAndLanguage(category, currentLanguage),
    [category, currentLanguage],
  );
  const selectedEntry = entries[level - 1];
  const levelTitle = (selectedEntry?.titulo ?? "").toString().trim();

  const answer = (entries[level - 1]?.respuesta ?? "").toString().trim();
  const answerChars = useMemo(() => answer.split(""), [answer]);
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") {
      return 360;
    }

    return window.innerWidth;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxCharsPerRow = useMemo(() => {
    const availableWidth = Math.min(
      560,
      Math.max(220, viewportWidth - ANSWER_CONTAINER_HORIZONTAL_PADDING_PX),
    );

    return Math.max(
      MIN_CHARS_PER_ROW,
      Math.floor(
        (availableWidth + ANSWER_TILE_GAP_PX) /
          (ANSWER_TILE_SIZE_PX + ANSWER_TILE_GAP_PX),
      ),
    );
  }, [viewportWidth]);

  const answerRows = useMemo(() => {
    const rows: AnswerRenderToken[][] = [];
    const baseRows: number[][] = [];
    let currentBaseRow: number[] = [];
    let hyphenCounter = 0;

    answerChars.forEach((char, index) => {
      if (char === "|") {
        baseRows.push(currentBaseRow);
        currentBaseRow = [];
      } else {
        currentBaseRow.push(index);
      }
    });

    baseRows.push(currentBaseRow);

    const pushTrimmedRow = (tokens: AnswerRenderToken[]) => {
      const next = [...tokens];

      while (
        next[0]?.kind === "char" &&
        answerChars[next[0].charIndex] === " "
      ) {
        next.shift();
      }

      while (
        next[next.length - 1]?.kind === "char" &&
        answerChars[(next[next.length - 1] as { kind: "char"; charIndex: number }).charIndex] ===
          " "
      ) {
        next.pop();
      }

      if (next.length > 0) {
        rows.push(next);
      }
    };

    baseRows.forEach((baseRow) => {
      const groups: Array<{ leadingSpaceIndex: number | null; word: number[] }> = [];
      let pendingSpaceIndex: number | null = null;

      for (let index = 0; index < baseRow.length; index += 1) {
        const charIndex = baseRow[index];
        const char = answerChars[charIndex];

        if (char === " ") {
          if (pendingSpaceIndex === null) {
            pendingSpaceIndex = charIndex;
          }
          continue;
        }

        const word: number[] = [charIndex];
        let cursor = index + 1;

        while (cursor < baseRow.length) {
          const nextCharIndex = baseRow[cursor];
          if (answerChars[nextCharIndex] === " ") {
            break;
          }

          word.push(nextCharIndex);
          cursor += 1;
        }

        groups.push({ leadingSpaceIndex: pendingSpaceIndex, word });
        pendingSpaceIndex = null;
        index = cursor - 1;
      }

      let currentRowTokens: AnswerRenderToken[] = [];
      let currentRowUnits = 0;

      const flushCurrentRow = () => {
        pushTrimmedRow(currentRowTokens);
        currentRowTokens = [];
        currentRowUnits = 0;
      };

      groups.forEach((group) => {
        let remainingWord = [...group.word];
        let useLeadingSpace = group.leadingSpaceIndex !== null;

        while (remainingWord.length > 0) {
          const leadingSpaceUnits =
            useLeadingSpace && currentRowUnits > 0 && group.leadingSpaceIndex !== null
              ? 1
              : 0;
          const availableUnits = maxCharsPerRow - currentRowUnits - leadingSpaceUnits;

          if (remainingWord.length <= availableUnits) {
            if (leadingSpaceUnits > 0 && group.leadingSpaceIndex !== null) {
              currentRowTokens.push({
                kind: "char",
                charIndex: group.leadingSpaceIndex,
              });
              currentRowUnits += 1;
            }

            remainingWord.forEach((charIndex) => {
              currentRowTokens.push({ kind: "char", charIndex });
            });
            currentRowUnits += remainingWord.length;
            remainingWord = [];
            continue;
          }

          if (currentRowUnits > 0) {
            flushCurrentRow();
            useLeadingSpace = false;
            continue;
          }

          const maxChunkLength = Math.max(2, maxCharsPerRow - 1);
          const remainingWordChars = remainingWord.map(
            (charIndex) => answerChars[charIndex],
          );
          const remainingWordText = remainingWordChars.join("");
          const syllableBreakPoint = getSyllableBreakPoint(
            remainingWordText,
            maxChunkLength,
          );

          const chunkLength = Math.min(
            syllableBreakPoint ??
              getRecommendedBreakPoint(remainingWordChars, maxChunkLength),
            remainingWord.length,
          );

          remainingWord.slice(0, chunkLength).forEach((charIndex) => {
            currentRowTokens.push({ kind: "char", charIndex });
          });
          currentRowUnits += chunkLength;

          if (chunkLength < remainingWord.length) {
            currentRowTokens.push({
              kind: "hyphen",
              key: `hyphen-${hyphenCounter}`,
            });
            hyphenCounter += 1;
            flushCurrentRow();
          }

          remainingWord = remainingWord.slice(chunkLength);
          useLeadingSpace = false;
        }
      });

      flushCurrentRow();
    });

    return rows;
  }, [answerChars, maxCharsPerRow]);

  const randomImageCategory = resolveRandomImageCategory(selectedEntry?.categoria);
  const randomImageLevel = parseLevelNumber(selectedEntry?.pregunta) ?? level;
  const imageCategory = category === ALEATORIO ? randomImageCategory : effectiveCategory;
  const imageLevel = category === ALEATORIO ? randomImageLevel : level;

  const svgConfig = svgByCategory[imageCategory] ?? svgByCategory[ACERTIJOS];
  const svgPath = svgConfig.getPath(imageLevel);
  const svgLoader =
    svgConfig.modules[svgPath] ?? Object.values(svgConfig.modules)[imageLevel - 1];
  const PuzzleImage = useMemo(() => {
    if (!svgLoader) return null;

    return lazy(svgLoader as () => Promise<{ default: ComponentType }>);
  }, [svgLoader]);

  const [revealedChars, setRevealedChars] = useState<boolean[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [failTimerSeconds, setFailTimerSeconds] = useState(FAIL_TIMER_SECONDS);

  const categoryLabelByKey: Record<string, string> = {
    [ACERTIJOS]: t.categoryRiddles,
    [PELICULAS]: t.categoryMovies,
    [LOGOS]: t.categoryLogos,
    [EMOJIS]: t.categoryEmojis,
    [SOMBRAS]: t.categoryShadows,
    [FUNKOS]: t.categoryFunkos,
    [ESCUDOS]: t.categoryShields,
    [BANDERAS]: t.categoryFlags,
    [ALEATORIO]: t.categoryRandom,
  };

  const displayCategory = categoryLabelByKey[category] ?? t.categoryRiddles;
  const headerTitle =
    category === ALEATORIO && levelTitle ? levelTitle : displayCategory;

  useEffect(() => {
    if (!answer || (randomImageCategory !== QUESTIONS && !PuzzleImage) || level > totalLevels) {
      navigate("/levels", { state: { category } });
      return;
    }

    localStorage.setItem(LAST_PLAYED_AT_KEY, new Date().toISOString());
    localStorage.setItem(LAST_PLAYED_CATEGORY_KEY, effectiveCategory);
  }, [
    answer,
    PuzzleImage,
    category,
    effectiveCategory,
    level,
    navigate,
    randomImageCategory,
    totalLevels,
  ]);

  useEffect(() => {
    setRevealedChars(answerChars.map((char) => !isGuessableChar(char)));
    setGuessedLetters([]);
    setWrongLetters([]);
    setLives(3);
    setShowSuccessModal(false);
    setShowFailModal(false);
  }, [answerChars]);

  useEffect(() => {
    if (typeof window.adConfig === "function") {
      window.adConfig({ preloadAdBreaks: "on" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = useCallback(
    (key: string) => {
      if (showSuccessModal || showFailModal || !answer) return;

      const normalizedGuess = normalizeText(key).trim().charAt(0);
      if (!normalizedGuess || guessedLetters.includes(normalizedGuess)) return;

      let hasHit = false;
      const nextRevealed = [...revealedChars];

      answerChars.forEach((char, index) => {
        if (
          isGuessableChar(char) &&
          normalizeText(char).charAt(0) === normalizedGuess
        ) {
          nextRevealed[index] = true;
          hasHit = true;
        }
      });

      const isSolved = answerChars.every(
        (char, index) => !isGuessableChar(char) || nextRevealed[index],
      );

      setGuessedLetters((prev) => [...prev, normalizedGuess]);
      setRevealedChars(nextRevealed);

      if (hasHit) {
        if (isSolved) {
          setShowSuccessModal(true);
        }
        return;
      }

      setWrongLetters((prev) => [...prev, normalizedGuess]);

      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setShowFailModal(true);
      }
    },
    [
      answer,
      answerChars,
      guessedLetters,
      lives,
      revealedChars,
      showFailModal,
      showSuccessModal,
    ],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA") {
        return;
      }

      if (event.key.length === 1) {
        handleGuess(event.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleGuess]);

  useEffect(() => {
    if (!showSuccessModal) return;

    const timeoutId = setTimeout(() => {
      const nextLevel = Math.min(level + 1, totalLevels);
      const currentProgress = parseInt(
        localStorage.getItem(progressStorageKey) || "1",
        10,
      );

      if (level >= currentProgress) {
        localStorage.setItem(progressStorageKey, String(nextLevel));
        window.dispatchEvent(new CustomEvent("imaginalo:progress-updated"));
      }

      if (level < totalLevels) {
        navigate("/game", { state: { level: level + 1, category } });
      } else {
        navigate("/levels", { state: { category } });
      }
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [
    category,
    level,
    navigate,
    progressStorageKey,
    showSuccessModal,
    totalLevels,
  ]);

  const handleRetry = () => {
    setRevealedChars(answerChars.map((char) => !isGuessableChar(char)));
    setGuessedLetters([]);
    setWrongLetters([]);
    setLives(3);
    setShowFailModal(false);
  };

  const handleWatchAd = useCallback(() => {
    if (!Array.isArray(window.adsbygoogle)) {
      return;
    }

    // Eliminar instancia anterior si existe
    const prev = document.getElementById("imaginalo-rewarded-ad");
    if (prev) prev.remove();

    // Crear elemento <ins> para el anuncio de recompensa
    const ins = document.createElement("ins");
    ins.id = "imaginalo-rewarded-ad";
    ins.className = "adsbygoogle";
    ins.style.display = "none";
    ins.setAttribute("data-ad-client", ADSENSE_CLIENT);
    ins.setAttribute("data-ad-slot", ADSENSE_REWARDED_SLOT);
    ins.setAttribute("data-ad-format", "rewarded");
    document.body.appendChild(ins);

    const cleanup = () => {
      const el = document.getElementById("imaginalo-rewarded-ad");
      if (el) el.remove();
    };

    window.adsbygoogle.push({
      done: (grantedReward: { type: string; amount: number } | null) => {
        cleanup();
        if (grantedReward) {
          setLives(3);
          setRevealedChars(answerChars.map((char) => !isGuessableChar(char)));
          setGuessedLetters([]);
          setWrongLetters([]);
          setShowFailModal(false);
        }
        // si no hay reward, el modal sigue abierto con el timer
      },
    });
  }, [answerChars]);

  // Inicializar bloque de display cuando el modal de fallo abre
  useEffect(() => {
    if (!showFailModal) return;

    const timeoutId = setTimeout(() => {
      try {
        if (Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle.push({});
        }
      } catch {
        // adsbygoogle no disponible en dev
      }
    }, 300); // esperar que el DOM del modal esté montado

    return () => clearTimeout(timeoutId);
  }, [showFailModal]);

  useEffect(() => {
    if (!showFailModal) {
      setFailTimerSeconds(FAIL_TIMER_SECONDS);
      return;
    }

    if (failTimerSeconds <= 0) return;

    const interval = setInterval(() => {
      setFailTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [showFailModal, failTimerSeconds]);

  if (!answer || (randomImageCategory !== QUESTIONS && !PuzzleImage)) {
    return (
      <Layout>
        <Typography sx={{ color: "#fff" }}>{t.invalidLevel}</Typography>
      </Layout>
    );
  }

  return (
    <Layout
      showFooter={false}
      headerTitle={headerTitle}
      headerRight={
        <>
          {t.levelShort}
          <br />
          {level}
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: 1,
          pb: { xs: 30, md: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 560,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: 32, lineHeight: 1 }}>
            {"🤍".repeat(lives)}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            borderRadius: 1,
            backgroundColor: "#fff",
            border: "4px solid #1f254d",
            minHeight: { xs: 280, md: 420 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            "& svg": {
              width: "80%",
              height: "auto",
              maxHeight: "100%",
            },
          }}
        >
          {randomImageCategory === QUESTIONS ? (
            <Typography sx={{ color: "#fff", textAlign: "center", px: 2 }}>
              {selectedEntry?.pregunta ?? ""}
            </Typography>
          ) : (
            PuzzleImage && (
              <Suspense fallback={<Box sx={{ width: "100%", height: "100%" }} />}>
                <PuzzleImage />
              </Suspense>
            )
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 560,
            mt: 2.2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {answerRows.map((row, rowIndex) => (
            <Typography
              key={`row-${rowIndex}`}
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                flexWrap: "nowrap",
              }}
            >
              {row.map((token) => {
                if (token.kind === "hyphen") {
                  return (
                    <Typography
                      key={token.key}
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 24,
                        lineHeight: 1,
                        px: 0.15,
                      }}
                    >
                      -
                    </Typography>
                  );
                }

                const charIndex = token.charIndex;
                const char = answerChars[charIndex];

                if (char === " ") {
                  return <Box key={`space-${charIndex}`} sx={{ width: 14 }} />;
                }

                if (!isGuessableChar(char)) {
                  return (
                    <Typography
                      key={`symbol-${charIndex}`}
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 28,
                        px: 0.4,
                      }}
                    >
                      {char}
                    </Typography>
                  );
                }

                return (
                  <Paper
                    key={`char-${charIndex}`}
                    elevation={3}
                    sx={{
                      width: "26px",
                      height: "26px",
                      borderRadius: 1,
                      border: "2px solid #1f254d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#59607a",
                      lineHeight: 1,
                    }}
                  >
                    {revealedChars[charIndex] ? char.toUpperCase() : "_"}
                  </Paper>
                );
              })}
            </Typography>
          ))}
        </Box>
      </Box>

      <VirtualKeyboard
        onKeyPress={handleGuess}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
      />

      <Modal
        open={showSuccessModal}
        onClose={() => {}}
        aria-labelledby="success-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            minWidth: 260,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 0.8, fontSize: "46px" }}>
            🎉
          </Typography>
          <Typography
            id="success-modal-title"
            sx={{ color: "#e74c3c", fontWeight: 700, mb: 0.6, fontSize: 26 }}
          >
            {t.excellent}
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 14 }}>
            {t.nextScreen}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={showFailModal}
        onClose={() => {}}
        aria-labelledby="fail-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            minWidth: 280,
            maxWidth: 340,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 0.8, fontSize: "42px" }}>
            💔
          </Typography>
          <Typography
            id="fail-modal-title"
            sx={{ color: "#e74c3c", fontWeight: 700, mb: 1.5, fontSize: 24 }}
          >
            {t.gameOverLives}
          </Typography>
          {failTimerSeconds > 0 ? (
            <>
              {/* Bloque de display AdSense mientras corre el timer */}
              <Box
                sx={{
                  width: "100%",
                  minHeight: 100,
                  mb: 2,
                  overflow: "hidden",
                  borderRadius: 1,
                }}
              >
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client={ADSENSE_CLIENT}
                  data-ad-slot={ADSENSE_DISPLAY_SLOT}
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </Box>
              <Typography sx={{ color: "#999", fontSize: 13, mb: 2 }}>
                {t.nextFreeRetry}: {formatFailTimer(failTimerSeconds)}
              </Typography>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{ backgroundColor: "#e74c3c", "&:hover": { backgroundColor: "#c0392b" } }}
            >
              {t.tryAgain}
            </Button>
          )}
        </Box>
      </Modal>
    </Layout>
  );
};

export default Game;
