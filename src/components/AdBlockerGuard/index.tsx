import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useLanguage } from "../../i18n/LanguageContext";

const BAIT_ID = "imaginalo-ad-bait";

const createBait = (): HTMLElement => {
  const bait = document.createElement("div");
  bait.id = BAIT_ID;
  bait.className = "ad-banner ads adsbox doubleclick ad-placement";
  bait.style.cssText =
    "width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
  document.body.appendChild(bait);
  return bait;
};

const detectAdBlocker = (): Promise<boolean> =>
  new Promise((resolve) => {
    const bait = createBait();

    // Dar tiempo al bloqueador para actuar
    setTimeout(() => {
      const el = document.getElementById(BAIT_ID);
      const blocked =
        !el ||
        el.offsetHeight === 0 ||
        el.offsetWidth === 0 ||
        window.getComputedStyle(el).display === "none" ||
        window.getComputedStyle(el).visibility === "hidden";

      bait.remove();
      resolve(blocked);
    }, 200);
  });

const AdBlockerGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useLanguage();
  const [blocked, setBlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    detectAdBlocker().then((isBlocked) => {
      setBlocked(isBlocked);
      setChecked(true);
    });
  }, []);

  const handleRetryCheck = () => {
    setChecked(false);
    detectAdBlocker().then((isBlocked) => {
      setBlocked(isBlocked);
      setChecked(true);
    });
  };

  // Mientras chequea, no muestra nada (evita flash)
  if (!checked) return null;

  if (!blocked) return <>{children}</>;

  return (
    <>
      {/* Fondo bloqueante */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(0,0,0,0.82)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: 4,
            p: 4,
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <Typography sx={{ fontSize: 52, mb: 1 }}>🚫</Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#e74c3c", mb: 1.5, fontSize: 20 }}
          >
            {t.adBlockerTitle}
          </Typography>
          <Typography sx={{ color: "#555", fontSize: 14, mb: 3, lineHeight: 1.6 }}>
            {t.adBlockerMessage}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRetryCheck}
            sx={{
              backgroundColor: "#e74c3c",
              "&:hover": { backgroundColor: "#c0392b" },
              py: 1.4,
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 2,
            }}
          >
            {t.adBlockerButton}
          </Button>
        </Box>
      </Box>
      {/* Contenido debajo (no interactuable) */}
      <Box sx={{ pointerEvents: "none", userSelect: "none", filter: "blur(4px)" }}>
        {children}
      </Box>
    </>
  );
};

export default AdBlockerGuard;
