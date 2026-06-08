import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
import aleatoriosData from "../data/aleatorios.json";
import aleatoriosEnData from "../data/aleatorios_en.json";
import aleatoriosSpData from "../data/aleatorios_sp.json";

const CATEGORY_LEVEL_COUNT: Record<string, number> = {
  [ACERTIJOS]: 264,
  [PELICULAS]: 184,
  [LOGOS]: 100,
  [EMOJIS]: 129,
  [SOMBRAS]: 172,
  [FUNKOS]: 100,
  [ESCUDOS]: 100,
  [BANDERAS]: 100,
};

const WUZZLES_LEVEL_COUNT = 120;

const Levels: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage } = useLanguage();
  const category =
    (location.state as { category?: string } | null)?.category ?? ACERTIJOS;
  const randomLevelsCount = useMemo(() => {
    if (currentLanguage === "en") {
      return (aleatoriosEnData as { preguntas?: unknown[] }).preguntas?.length ?? 1;
    }

    if (currentLanguage === "es_sp") {
      return (aleatoriosSpData as { preguntas?: unknown[] }).preguntas?.length ?? 1;
    }

    return (aleatoriosData as { preguntas?: unknown[] }).preguntas?.length ?? 1;
  }, [currentLanguage]);

  const totalLevels =
    category === ALEATORIO
      ? randomLevelsCount
      : category === ACERTIJOS && currentLanguage === "en"
      ? WUZZLES_LEVEL_COUNT
      : CATEGORY_LEVEL_COUNT[category] ?? 20;
  const progressCategoryKey =
    category === ACERTIJOS && currentLanguage === "en" ? ALEATORIO : category;
  const progressStorageKey = `imaginalo_progress_${progressCategoryKey}_${currentLanguage}`;
  const categoryTitleByKey: Record<string, string> = {
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
  const levelsTitle = categoryTitleByKey[category] ?? t.categoryRiddles;

  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const savedProgress = localStorage.getItem(progressStorageKey);
    if (savedProgress) {
      return parseInt(savedProgress, 10);
    } else {
      localStorage.setItem(progressStorageKey, "1");
      return 1;
    }
  });

  const syncUnlockedLevel = useCallback(() => {
    const savedProgress = localStorage.getItem(progressStorageKey);

    if (savedProgress) {
      const parsed = parseInt(savedProgress, 10);
      const safeLevel = Number.isFinite(parsed)
        ? Math.min(Math.max(parsed, 1), totalLevels)
        : 1;
      setUnlockedLevel(safeLevel);
      return;
    }

    localStorage.setItem(progressStorageKey, "1");
    setUnlockedLevel(1);
  }, [progressStorageKey, totalLevels]);

  useEffect(() => {
    syncUnlockedLevel();
  }, [syncUnlockedLevel]);

  // Actualizar progreso cuando el componente se hace visible
  useEffect(() => {
    const handleFocus = () => syncUnlockedLevel();
    const handleProgressUpdated = () => syncUnlockedLevel();
    const handleLanguageChanged = () => syncUnlockedLevel();

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
  }, [syncUnlockedLevel]);

  // Scroll animado al primer nivel bloqueado o al último si todos están desbloqueados
  useEffect(() => {
    const firstLockedLevel = unlockedLevel + 1;

    setTimeout(() => {
      if (firstLockedLevel <= totalLevels) {
        const lockedElement = document.querySelector(
          `[data-level="${firstLockedLevel}"]`,
        );
        if (lockedElement) {
          lockedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      } else {
        const lastElement = document.querySelector(
          `[data-level="${totalLevels}"]`,
        );
        if (lastElement) {
          lastElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, 500);
  }, [totalLevels, unlockedLevel]);

  const handleClearProgress = () => {
    localStorage.removeItem(progressStorageKey);
    setUnlockedLevel(1);
    window.dispatchEvent(new CustomEvent("imaginalo:progress-updated"));
  };

  const handleLevelClick = (level: number) => {
    if (level <= unlockedLevel) {
      navigate(`/game`, { state: { level, category } });
    }
  };

  // Emojis de números del 0 al 9
  const digitEmojis = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
  ];

  // Generar los pares de emojis según la cantidad real de niveles
  const numberEmojis = Array.from({ length: totalLevels }, (_, i) => {
    const n = i + 1;
    const isUnlocked = n <= unlockedLevel;

    if (!isUnlocked) {
      return <span style={{ fontSize: "24px" }}>🔒</span>;
    }

    const str = n.toString();
    return (
      <Stack
        direction="row"
        spacing={0.2}
        justifyContent="center"
        alignItems="center"
      >
        {str.split("").map((digit, index) => (
          <span
            key={index}
            style={{ fontSize: str.length >= 3 ? "18px" : "20px" }}
          >
            {digitEmojis[parseInt(digit, 10)]}
          </span>
        ))}
      </Stack>
    );
  });

  const levels = Array(totalLevels).fill(null);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
          px: 2,
        }}
      >
        {/* TODO: Cambiar por el título de tu juego */}
        <Typography
          variant="h4"
          sx={{ mb: 2, color: "#fff", fontWeight: 700, textAlign: "center" }}
        >
          {levelsTitle}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, color: "#fff", opacity: 0.8, textAlign: "center" }}
        >
          {t.findDifferentEmoji}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0.75,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {levels.map((_, i) => {
            const level = i + 1;
            const isUnlocked = level <= unlockedLevel;

            return (
              <Button
                key={i}
                variant="contained"
                data-level={level}
                onClick={() => handleLevelClick(level)}
                disabled={!isUnlocked}
                sx={{
                  background: isUnlocked ? "#fff" : "#ccc",
                  borderRadius: 2,
                  width: "100%",
                  aspectRatio: "1 / 1",
                  minWidth: 0,
                  minHeight: 0,
                  p: 1,
                  boxShadow: isUnlocked ? "0 2px 8px #0002" : "0 1px 4px #0001",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: isUnlocked ? "#222" : "#888",
                  transition: "transform 0.1s",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  "&:hover": {
                    background: isUnlocked ? "#f5f5f5" : "#ccc",
                    transform: isUnlocked ? "scale(1.02)" : "none",
                  },
                  "&:disabled": {
                    color: "#888",
                  },
                }}
              >
                {numberEmojis[i]}
              </Button>
            );
          })}
        </Box>

        {/* Botón para borrar progreso */}
        <Button
          variant="outlined"
          onClick={handleClearProgress}
          sx={{
            mt: 3,
            py: 1,
            px: 3,
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.6)",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          {t.clearProgress}
        </Button>
      </Box>
    </Layout>
  );
};

export default Levels;
