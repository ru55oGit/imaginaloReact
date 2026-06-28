import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/Home";
import Levels from "./pages/levels";
import Game from "./pages/game";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdBlockerGuard from "./components/AdBlockerGuard";

function App() {
  return (
    <Router>
      <AdBlockerGuard>
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
