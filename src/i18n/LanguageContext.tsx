import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Translation,
  translations,
  SupportedLanguage,
} from "./translations";

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  availableLanguages: Array<{
    code: SupportedLanguage;
    name: string;
    flag: string;
  }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "emojinalo_language";

export const availableLanguages = [
  { code: "es" as SupportedLanguage, name: "Español (Latam)", flag: "🇦🇷" },
  {
    code: "es_sp" as SupportedLanguage,
    name: "Español (España)",
    flag: "🇪🇸",
  },
  { code: "en" as SupportedLanguage, name: "English", flag: "🇺🇸" },
];

const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return value === "es" || value === "es_sp" || value === "en";
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>("es");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize language when component mounts
  useEffect(() => {
    if (hasInitialized) return;

    // Check if user has previously selected a language
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Default to Spanish for now
      setCurrentLanguage("es");
    }
    setHasInitialized(true);
  }, [hasInitialized]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.dispatchEvent(
      new CustomEvent("imaginalo:language-changed", {
        detail: { language },
      }),
    );
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage],
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
