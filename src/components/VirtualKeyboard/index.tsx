import React, { useState } from "react";
import { Box } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import KeyboardHideRoundedIcon from "@mui/icons-material/KeyboardHideRounded";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeText } from "../../utils/textNormalization";
import HouseAdBanner from "../../ads/HouseAdBanner";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters?: string[];
  wrongLetters?: string[];
  // Letras que el jugador "compró" eliminar viendo un anuncio (ver
  // onWatchAd) — se muestran deshabilitadas, ni cuentan como intento ni
  // cuestan vida si se tocan.
  eliminatedLetters?: string[];
  // La fila de números solo tiene sentido cuando la respuesta actual
  // realmente tiene algún dígito (títulos con año, trivia numérica,
  // etc.) — el resto de las veces es una fila entera que no sirve para
  // nada y hace el teclado más alto de lo necesario.
  hasNumbers?: boolean;
  // Mismo criterio para las dos filas de acentos de pt (Á À Â Ã É Ê / Í Ó
  // Ô Õ Ú Ç): dos filas enteras tapaban media pantalla en respuestas que
  // ni las necesitaban (ver conversación, caso "Logos" sin ningún acento).
  hasPtAccents?: boolean;
  includeActionKeys?: boolean;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  onWatchAd?: () => void;
  canWatchAd?: boolean;
  watchAdLoading?: boolean;
  // Cierra el teclado — ocupa el espaciador invisible que quedaba a la
  // izquierda de la fila Z-M en en/pt (no hay acento ni borrar que poner
  // ahí, ver conversación).
  onClose?: () => void;
  // Arranca cerrado (muestra un banner en su lugar) hasta que el juego pide
  // abrirlo — ver game.tsx, se abre cuando tocan un casillero en blanco.
  open?: boolean;
  gameSlug?: string;
  locale?: string;
}

// Mismo diseño que enroscaloReact/src/components/VirtualKeyboard (copiado
// y adaptado acá, no es un paquete compartido — ver convención del hub en
// la memoria del proyecto). Dos diferencias reales por cómo es este juego:
// 1. Hay una fila de números arriba de todo (algunas respuestas las usan,
//    ej. títulos con año), que enroscado no tiene.
// 2. Este juego es "al estilo ahorcado" — una letra tocada revela o
//    descuenta una vida al toque, no hay texto parcial que editar — así
//    que no existe el concepto de borrar. Donde en enroscado iría el
//    borrar (flanqueando la fila Z-M), a la izquierda va cerrar teclado
//    en en/pt (no hay acento ni borrar que poner ahí) y a la derecha un
//    espaciador invisible de mismo ancho: mantiene la alineación tipo
//    iPhone (fila corta centrada bajo las 10 columnas de arriba) sin un
//    segundo botón que no haría nada.
const NUM_ROW = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ES_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const LATIN_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];
const ACCENTED_VOWEL: Record<string, string> = { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const IS_VOWEL = (letter: string) => letter in ACCENTED_VOWEL;

// pt necesita sus propios acentos directos (no son un simple "modo
// acento" como en es — ç ni siquiera es una vocal acentuada), van en dos
// filas fijas arriba del todo.
const PT_ACCENT_ROWS = [
  ["Á", "À", "Â", "Ã", "É", "Ê"],
  ["Í", "Ó", "Ô", "Õ", "Ú", "Ç"],
];
const PT_ACCENT_BASE: Record<string, string> = {
  Á: "A", À: "A", Â: "A", Ã: "A", É: "E", Ê: "E",
  Í: "I", Ó: "O", Ô: "O", Õ: "O", Ú: "U", Ç: "C",
};

const keyButtonSx = (variant: "default" | "correct" | "incorrect" | "excluded" | "action") => ({
  flex: 1,
  minWidth: 0,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: "1px solid #666",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: variant === "correct" || variant === "incorrect" || variant === "excluded" ? "not-allowed" : "pointer",
  transition: "all 0.15s ease",
  "&:active": { transform: "scale(0.96)" },
  ...(variant === "default" && { backgroundColor: "#444", color: "#fff" }),
  ...(variant === "correct" && { backgroundColor: "#27ae60", borderColor: "#1e8449", color: "#fff" }),
  ...(variant === "incorrect" && { backgroundColor: "#e74c3c", borderColor: "#c0392b", color: "#fff" }),
  // Distinto del rojo "incorrect": esta letra no costó una vida, se sacó
  // gratis viendo un anuncio — el gris apagado evita que se confunda con
  // un intento fallido real.
  ...(variant === "excluded" && { backgroundColor: "#2a2a2a", borderColor: "#444", color: "#777" }),
  ...(variant === "action" && { backgroundColor: "#223a75", borderColor: "#1a2d58", color: "#fff", fontSize: 11 }),
});

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  guessedLetters = [],
  wrongLetters = [],
  eliminatedLetters = [],
  hasNumbers = false,
  hasPtAccents = false,
  includeActionKeys = false,
  soundEnabled = true,
  onSoundToggle,
  onWatchAd,
  canWatchAd = true,
  watchAdLoading = false,
  onClose,
  open = true,
  gameSlug = "imaginalo",
  locale = "es",
}) => {
  const isMobile = useIsMobile();
  const { t, currentLanguage } = useLanguage();
  const [accentActive, setAccentActive] = useState(false);

  const isEs = currentLanguage === "es" || currentLanguage === "es_sp";
  const isPt = currentLanguage === "pt";

  const isAlreadyGuessed = (letter: string) =>
    guessedLetters.some((guessed) => normalizeText(guessed) === letter);
  const isWrong = (letter: string) => wrongLetters.some((wrong) => normalizeText(wrong) === letter);
  const isEliminated = (letter: string) =>
    eliminatedLetters.some((eliminated) => normalizeText(eliminated) === letter);

  const pressLetter = (displayChar: string) => {
    const normalizedKey = normalizeText(displayChar);
    const alreadyTried = guessedLetters.some((guessed) => normalizeText(guessed) === normalizedKey);
    if (!alreadyTried && !isEliminated(normalizedKey)) {
      onKeyPress(displayChar);
    }
  };

  const handleLetterClick = (letter: string) => {
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    pressLetter(display);
    // Una vez tocada una vocal o cualquier consonante, el acento se
    // desactiva — es una tecla "muerta", no un modo que queda prendido.
    if (isEs) setAccentActive(false);
  };

  const handleSoundButton = (target: boolean) => {
    if (target !== soundEnabled) {
      onSoundToggle?.();
    }
  };

  const renderLetterKey = (letter: string) => {
    const correct = isAlreadyGuessed(letter) && !isWrong(letter);
    const wrong = isWrong(letter);
    const variant = correct ? "correct" : wrong ? "incorrect" : isEliminated(letter) ? "excluded" : "default";
    const display = isEs && accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    return (
      <Box
        key={letter}
        component="button"
        type="button"
        onClick={() => handleLetterClick(letter)}
        sx={keyButtonSx(variant)}
      >
        {display}
      </Box>
    );
  };

  const renderSpacer = (key: string) => (
    <Box key={key} aria-hidden sx={{ flex: 1.5, pointerEvents: "none" }} />
  );

  const renderCloseKeyboard = () => (
    <Box
      component="button"
      type="button"
      onClick={() => onClose?.()}
      aria-label="Cerrar teclado"
      sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
    >
      <KeyboardHideRoundedIcon sx={{ fontSize: 18 }} />
    </Box>
  );

  const renderPtAccentRows = () => (
    <>
      {PT_ACCENT_ROWS.map((row, rowIndex) => (
        <Box key={`pt-accent-${rowIndex}`} sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {row.map((char) => {
            const base = PT_ACCENT_BASE[char];
            const correct = isAlreadyGuessed(base) && !isWrong(base);
            const wrong = isWrong(base);
            const variant = correct ? "correct" : wrong ? "incorrect" : isEliminated(base) ? "excluded" : "default";
            return (
              <Box
                key={char}
                component="button"
                type="button"
                onClick={() => pressLetter(char)}
                sx={keyButtonSx(variant)}
              >
                {char}
              </Box>
            );
          })}
        </Box>
      ))}
    </>
  );

  const renderMainRows = () => {
    const row2 = isEs ? ES_ROW_2 : LATIN_ROW_2;
    return (
      <>
        {hasNumbers && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
            {NUM_ROW.map((digit) => renderLetterKey(digit))}
          </Box>
        )}
        {isPt && hasPtAccents && renderPtAccentRows()}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {ROW_1.map((letter) => renderLetterKey(letter))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {row2.map((letter) => renderLetterKey(letter))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {isEs ? (
            <Box
              component="button"
              type="button"
              onClick={() => setAccentActive((prev) => !prev)}
              aria-label="Acento"
              sx={{
                ...keyButtonSx("default"),
                flex: 1.5,
                fontSize: 16,
                fontWeight: 800,
                backgroundColor: accentActive ? "#f0b429" : "#444",
                color: accentActive ? "#1a1a1a" : "#fff",
                borderColor: accentActive ? "#d99f1a" : "#666",
              }}
            >
              ´
            </Box>
          ) : (
            renderCloseKeyboard()
          )}
          {ROW_3.map((letter) => renderLetterKey(letter))}
          {renderSpacer("flank-right")}
        </Box>
      </>
    );
  };

  const renderActionRow = () =>
    includeActionKeys && (
      <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        <Box
          component="button"
          type="button"
          onClick={() => handleSoundButton(true)}
          sx={{
            ...keyButtonSx("action"),
            flex: 1.4,
            height: 38,
            gap: "4px",
            backgroundColor: soundEnabled ? "#2ecc71" : "#223a75",
            borderColor: soundEnabled ? "#1e8449" : "#1a2d58",
          }}
        >
          <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />
          On
        </Box>
        <Box
          component="button"
          type="button"
          disabled={!canWatchAd}
          onClick={() => onWatchAd?.()}
          sx={{
            ...keyButtonSx("action"),
            flex: 7.2,
            height: 38,
            fontSize: 13,
            opacity: canWatchAd ? 1 : 0.5,
            cursor: canWatchAd ? "pointer" : "not-allowed",
          }}
        >
          {watchAdLoading ? "..." : t.watchAdEliminateButton}
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => handleSoundButton(false)}
          sx={{
            ...keyButtonSx("action"),
            flex: 1.4,
            height: 38,
            gap: "4px",
            backgroundColor: !soundEnabled ? "#e74c3c" : "#223a75",
            borderColor: !soundEnabled ? "#c0392b" : "#1a2d58",
          }}
        >
          <VolumeOffRoundedIcon sx={{ fontSize: 16 }} />
          Off
        </Box>
      </Box>
    );

  if (!isMobile) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "8px 4px 12px",
        zIndex: 1000,
        borderTop: "1px solid #555",
      }}
    >
      {open ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {renderMainRows()}
          {renderActionRow()}
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
          <HouseAdBanner slot="imaginalo-keyboard-banner" gameSlug={gameSlug} locale={locale} />
        </Box>
      )}
    </Box>
  );
};

export default VirtualKeyboard;
