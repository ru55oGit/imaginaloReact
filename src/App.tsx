import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import WelcomeScreen from "./pages/Home";
import Levels from "./pages/levels";
import Game from "./pages/game";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdBlockerGuard from "./components/AdBlockerGuard";
import { track } from "./lib/analytics";

// Pantallas reales de react-router (a diferencia del resto del hub, que es
// pantalla única): el gtag.js base solo manda el page_view automático en la
// carga inicial, no en estos cambios de ruta sin reload. Se salta el primer
// montaje a propósito — ese ya lo cubrió el page_view automático del script
// inline de index.html, trackearlo de nuevo acá lo duplicaría.
function RouteAnalytics() {
  const location = useLocation();
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    track("page_view", { page_title: document.title, page_location: window.location.href });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <Router>
      <AdBlockerGuard>
        <RouteAnalytics />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/game" element={<Game />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
        </Routes>
      </AdBlockerGuard>
    </Router>
  );
}

export default App;
