export interface Translation {
  // Home page
  appTitle: string;
  tagline: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  daysWithoutTrainingMessage: string;
  whatPlayToday: string;
  keepPlaying: string;
  continueButton: string;
  howToPlay: string;
  lookAtGrid: string;
  findDifferent: string;
  clickQuickly: string;
  playButton: string;

  // Language selector
  selectLanguage: string;
  spanish: string;
  english: string;
  portuguese: string;
  french: string;
  categoriesTitle: string;
  categoryRiddles: string;
  categoryMovies: string;
  categoryLogos: string;
  categoryEmojis: string;
  categoryShadows: string;
  categoryFunkos: string;
  categoryShields: string;
  categoryFlags: string;
  categoryRandom: string;
  ofWord: string;
  levelShort: string;

  // Levels page
  findEmoji: string;
  findDifferentEmoji: string;
  worldFlags: string;
  findFlagsDescription: string;
  moviesAndSeries: string;
  guessMoviesDescription: string;
  whatIsTitle: string;
  guessWhatDescription: string;

  // Menu
  home: string;
  findEmojiMenu: string;
  movies: string;
  flags: string;
  whatIs: string;
  language: string;

  // Game pages
  findDifferentEmoji2: string;
  findEmojiNotGroup: string;
  findFlagOf: string;
  guessCapitalNow: string;
  findEmojiNow: string;
  invalidLevel: string;

  // Success messages
  correct: string;
  excellent: string;
  nextScreen: string;
  itemNotFound: string;
  knowCapitals: string;

  // Exit confirmation popup
  confirmExit: string;
  loseProgress: string;
  cancel: string;
  confirm: string;

  // Game Over messages
  gameOverMovie: string;
  gameOverLives: string;
  tryAgain: string;
  studyGeography: string;
  tryAgainGeo: string;
  congratulations: string;
  completedAllScreens: string;
  clearProgress: string;
  recoverLives: string;
  nextFreeRetry: string;
  adBlockerTitle: string;
  adBlockerMessage: string;
  adBlockerButton: string;

  // About / How to play sections
  aboutTitle: string;
  aboutText: string;
  howToPlayTitle: string;
  howToPlayText: string;
}

export const translations: Record<string, Translation> = {
  es: {
    appTitle: "Imaginalo",
    tagline: "pensá · adiviná · ganá",
    goodMorning: "Buenos dias",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    daysWithoutTrainingMessage:
      "hace {{days}} dias que no ejercitas el cerebro.",
    whatPlayToday: "¿Listo para jugar Imaginalo 🤔?",
    keepPlaying: "SEGUIR JUGANDO",
    continueButton: "Continuar",
    howToPlay: "¿CÓMO JUGAR?",
    lookAtGrid: "Mirá la grilla",
    findDifferent: "Buscá el diferente",
    clickQuickly: "Clickealo rápido",
    playButton: "JUGAR",
    selectLanguage: "Seleccionar idioma",
    spanish: "Español",
    english: "Inglés",
    portuguese: "Portugués",
    french: "Francés",
    categoriesTitle: "CATEGORIAS",
    categoryRiddles: "ACERTIJOS",
    categoryMovies: "PELICULAS",
    categoryLogos: "LOGOS",
    categoryEmojis: "EMOJIS",
    categoryShadows: "SOMBRAS",
    categoryFunkos: "FUNKOS",
    categoryShields: "ESCUDOS",
    categoryFlags: "BANDERAS",
    categoryRandom: "ALEATORIO",
    ofWord: "de",
    levelShort: "Nivel",
    findEmoji: "🤔 Encuentra el emoji",
    findDifferentEmoji: "Seleccioná un nivel y poné a prueba tu mente.",
    worldFlags: "🗺️ Banderas del Mundo",
    findFlagsDescription: "¡Encuentra las banderas de diferentes países!",
    moviesAndSeries: "🎬 Películas y Series",
    guessMoviesDescription: "¡Adivina las películas y series con emojis!",
    whatIsTitle: "🤔 ¿Qué es?",
    guessWhatDescription: "¡Adivina qué representa cada emoji!",
    home: "🏠 Inicio",
    findEmojiMenu: "🔍 Encuentra el emoji",
    movies: "🎬 Películas",
    flags: "🚩 Banderas",
    whatIs: "❓ ¿Qué es?",
    language: "🌐 Idioma",
    findDifferentEmoji2: "Encuentra el Emoji diferente",
    findEmojiNotGroup: "Encuentra el Emoji que no pertenece al grupo",
    findFlagOf: "Encuentra la bandera de",
    guessCapitalNow: "Ahora adivina la capital...",
    findEmojiNow: "Ahora encuentra el emoji...",
    invalidLevel: "Error: Nivel no válido",
    itemNotFound: "Error: Item no encontrado",
    correct: "¡Acertaste!",
    excellent: "🎉 ¡Excelente!",
    nextScreen: "Pasando a las siguiente pantalla",
    knowCapitals: "🎉 ¡Conoces las capitales!",
    confirmExit: "¿Desea Salir?",
    loseProgress: "Se perderá el progreso actual del juego",
    cancel: "CANCELAR",
    confirm: "CONFIRMAR",
    gameOverMovie: "🌬️ ¡El telón se cerró!",
    gameOverLives: "💔 ¡Se acabaron las vidas!",
    tryAgain: "Volvamos a intentarlo...",
    studyGeography: "🗺️ ¡Hora de estudiar geografía!",
    tryAgainGeo: "Inténtalo de nuevo...",
    congratulations: "¡Felicitaciones!",
    completedAllScreens: "¡Completaste todas las pantallas!",
    clearProgress: "Borrar Progreso",
    recoverLives: "Recupera tus vidas",
    nextFreeRetry: "Reintento libre en",
    adBlockerTitle: "Tenés un bloqueador de anuncios activo",
    adBlockerMessage: "Este juego es gratuito gracias a los anuncios. Por favor desactivá tu bloqueador para poder jugar.",
    adBlockerButton: "Ya lo desactivé, continuar",
    aboutTitle: "¿Qué es Imaginalo?",
    aboutText: "Imaginalo es un juego de adivinanzas visual donde tenés que identificar películas, logos, sombras, emojis, banderas y más a partir de imágenes. Contiene cientos de niveles organizados en categorías para todos los gustos.",
    howToPlayTitle: "¿Cómo jugar?",
    howToPlayText: "Elegí una categoría, mirá la imagen o el emoji y escribí tu respuesta. Si no sabés, avanzá al siguiente nivel y volvé después. Cada categoría tiene decenas de niveles con dificultad creciente.",
  },

  en: {
    appTitle: "Imaginalo",
    tagline: "think · guess · win",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    daysWithoutTrainingMessage:
      "it has been {{days}} days since you trained your brain.",
    whatPlayToday: "What are we playing today?",
    keepPlaying: "KEEP PLAYING",
    continueButton: "Continue",
    howToPlay: "HOW TO PLAY?",
    lookAtGrid: "Look at the grid",
    findDifferent: "Find the different one",
    clickQuickly: "Click it quickly",
    playButton: "PLAY",
    selectLanguage: "Select language",
    spanish: "Spanish",
    english: "English",
    portuguese: "Portuguese",
    french: "French",
    categoriesTitle: "CATEGORIES",
    categoryRiddles: "RIDDLES",
    categoryMovies: "MOVIES",
    categoryLogos: "LOGOS",
    categoryEmojis: "EMOJIS",
    categoryShadows: "SHADOWS",
    categoryFunkos: "FUNKOS",
    categoryShields: "SHIELDS",
    categoryFlags: "FLAGS",
    categoryRandom: "RANDOM",
    ofWord: "of",
    levelShort: "Level",
    findEmoji: "🤔 Find the emoji",
    findDifferentEmoji: "Choose a level and put your mind to the test.",
    worldFlags: "🗺️ World Flags",
    findFlagsDescription: "Find the flags of different countries!",
    moviesAndSeries: "🎬 Movies and Series",
    guessMoviesDescription: "Guess the movies and series with emojis!",
    whatIsTitle: "🤔 What is?",
    guessWhatDescription: "Guess what each emoji represents!",
    home: "🏠 Home",
    findEmojiMenu: "🔍 Find the emoji",
    movies: "🎬 Movies",
    flags: "🚩 Flags",
    whatIs: "❓ What is?",
    language: "🌐 Language",
    findDifferentEmoji2: "Find the different emoji",
    findEmojiNotGroup: "Find the emoji that doesn't belong to the group",
    findFlagOf: "Find the flag of",
    guessCapitalNow: "Now guess the capital...",
    findEmojiNow: "Now find the emoji...",
    invalidLevel: "Error: Invalid level",
    itemNotFound: "Error: Item not found",
    correct: "You got it!",
    excellent: "🎉 Excellent!",
    nextScreen: "Moving to the next screen",
    knowCapitals: "🎉 You know the capitals!",
    confirmExit: "Do you want to exit?",
    loseProgress: "You will lose the current game progress",
    cancel: "CANCEL",
    confirm: "CONFIRM",
    gameOverMovie: "🌬️ The curtain fell!",
    gameOverLives: "💔 Lives are over!",
    tryAgain: "Let's try again...",
    studyGeography: "🗺️ Time to study geography!",
    tryAgainGeo: "Try again...",
    congratulations: "Congratulations!",
    completedAllScreens: "You completed all the screens!",
    clearProgress: "Clear Progress",
    recoverLives: "Recover your lives",
    nextFreeRetry: "Free retry in",
    adBlockerTitle: "Ad blocker detected",
    adBlockerMessage: "This game is free thanks to ads. Please disable your ad blocker to continue playing.",
    adBlockerButton: "I disabled it, continue",
    aboutTitle: "What is Imaginalo?",
    aboutText: "Imaginalo is a visual guessing game where you have to identify movies, logos, silhouettes, emojis, flags and more from images. It contains hundreds of levels organized into categories for every taste.",
    howToPlayTitle: "How to play?",
    howToPlayText: "Choose a category, look at the image or emoji and type your answer. If you don't know, move on to the next level and come back later. Each category has dozens of levels with increasing difficulty.",
  },

  pt: {
    appTitle: "Imaginalo",
    tagline: "pense · adivinhe · ganhe",
    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    goodEvening: "Boa noite",
    daysWithoutTrainingMessage:
      "faz {{days}} dias que voce nao exercita o cerebro.",
    whatPlayToday: "O que vamos jogar hoje?",
    keepPlaying: "CONTINUAR JOGANDO",
    continueButton: "Continuar",
    howToPlay: "COMO JOGAR?",
    lookAtGrid: "Olhe a grade",
    findDifferent: "Encontre o diferente",
    clickQuickly: "Clique rapidamente",
    playButton: "JOGAR",
    selectLanguage: "Selecionar idioma",
    spanish: "Espanhol",
    english: "Inglês",
    portuguese: "Português",
    french: "Francês",
    categoriesTitle: "CATEGORIAS",
    categoryRiddles: "ENIGMAS",
    categoryMovies: "FILMES",
    categoryLogos: "LOGOS",
    categoryEmojis: "EMOJIS",
    categoryShadows: "SOMBRAS",
    categoryFunkos: "FUNKOS",
    categoryShields: "ESCUDOS",
    categoryFlags: "BANDEIRAS",
    categoryRandom: "ALEATORIO",
    ofWord: "de",
    levelShort: "NIV",
    findEmoji: "🤔 Encontre o emoji",
    findDifferentEmoji: "Descubra qual emoji é diferente!",
    worldFlags: "🗺️ Bandeiras do Mundo",
    findFlagsDescription: "Encontre as bandeiras de diferentes países!",
    moviesAndSeries: "🎬 Filmes e Séries",
    guessMoviesDescription: "Adivinhe os filmes e séries com emojis!",
    whatIsTitle: "🤔 O que é?",
    guessWhatDescription: "Adivinhe o que cada emoji representa!",
    home: "🏠 Início",
    findEmojiMenu: "🔍 Encontre o emoji",
    movies: "🎬 Filmes",
    flags: "🚩 Bandeiras",
    whatIs: "❓ O que é?",
    language: "🌐 Idioma",
    findDifferentEmoji2: "Encontre o emoji diferente",
    findEmojiNotGroup: "Encontre o emoji que não pertence ao grupo",
    findFlagOf: "Encontre a bandeira de",
    guessCapitalNow: "Agora adivinhe a capital...",
    findEmojiNow: "Agora encontre o emoji...",
    invalidLevel: "Erro: Nível inválido",
    itemNotFound: "Erro: Item não encontrado",
    correct: "Você acertou!",
    excellent: "🎉 Excelente!",
    nextScreen: "Passando para a próxima tela",
    knowCapitals: "🎉 Você conhece as capitais!",
    confirmExit: "Deseja sair?",
    loseProgress: "Você perderá o progresso atual do jogo",
    cancel: "CANCELAR",
    confirm: "CONFIRMAR",
    gameOverMovie: "🌬️ A cortina caiu!",
    gameOverLives: "💔 As vidas acabaram!",
    tryAgain: "Vamos tentar novamente...",
    studyGeography: "🗺️ Hora de estudar geografia!",
    tryAgainGeo: "Tente novamente...",
    congratulations: "Parabéns!",
    completedAllScreens: "Você completou todas as telas!",
    clearProgress: "Limpar Progresso",
    recoverLives: "Recupere suas vidas",
    nextFreeRetry: "Próxima tentativa gratuita em",
    adBlockerTitle: "Bloqueador de anúncios detectado",
    adBlockerMessage: "Este jogo é gratuito graças aos anúncios. Desative seu bloqueador para continuar jogando.",
    adBlockerButton: "Já desativei, continuar",
    aboutTitle: "O que é Imaginalo?",
    aboutText: "Imaginalo é um jogo de adivinhação visual onde você precisa identificar filmes, logos, silhuetas, emojis, bandeiras e mais a partir de imagens. Contém centenas de níveis organizados em categorias para todos os gostos.",
    howToPlayTitle: "Como jogar?",
    howToPlayText: "Escolha uma categoria, olhe para a imagem ou emoji e digite sua resposta. Se não souber, avance para o próximo nível e volte depois. Cada categoria tem dezenas de níveis com dificuldade crescente.",
  },

  fr: {
    appTitle: "Imaginalo",
    tagline: "pensez · devinez · gagnez",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    daysWithoutTrainingMessage:
      "cela fait {{days}} jours que vous n'avez pas entraine votre cerveau.",
    whatPlayToday: "A quoi on joue aujourd'hui ?",
    keepPlaying: "CONTINUER A JOUER",
    continueButton: "Continuer",
    howToPlay: "COMMENT JOUER?",
    lookAtGrid: "Regardez la grille",
    findDifferent: "Trouvez le différent",
    clickQuickly: "Cliquez rapidement",
    playButton: "JOUER",
    selectLanguage: "Sélectionner la langue",
    spanish: "Espagnol",
    english: "Anglais",
    portuguese: "Portugais",
    french: "Français",
    categoriesTitle: "CATEGORIES",
    categoryRiddles: "ENIGMES",
    categoryMovies: "FILMS",
    categoryLogos: "LOGOS",
    categoryEmojis: "EMOJIS",
    categoryShadows: "OMBRES",
    categoryFunkos: "FUNKOS",
    categoryShields: "ECUSSONS",
    categoryFlags: "DRAPEAUX",
    categoryRandom: "ALEATOIRE",
    ofWord: "de",
    levelShort: "NIV",
    findEmoji: "🤔 Trouvez l'emoji",
    findDifferentEmoji: "Découvrez quel emoji est différent!",
    worldFlags: "🗺️ Drapeaux du Monde",
    findFlagsDescription: "Trouvez les drapeaux de différents pays!",
    moviesAndSeries: "🎬 Films et Séries",
    guessMoviesDescription: "Devinez les films et séries avec des emojis!",
    whatIsTitle: "🤔 Qu'est-ce que?",
    guessWhatDescription: "Devinez ce que chaque emoji représente!",
    home: "🏠 Accueil",
    findEmojiMenu: "🔍 Trouvez l'emoji",
    movies: "🎬 Films",
    flags: "🚩 Drapeaux",
    whatIs: "❓ Qu'est-ce que?",
    language: "🌐 Langue",
    findDifferentEmoji2: "Trouvez l'emoji différent",
    findEmojiNotGroup: "Trouvez l'emoji qui n'appartient pas au groupe",
    findFlagOf: "Trouvez le drapeau de",
    guessCapitalNow: "Maintenant devinez la capitale...",
    findEmojiNow: "Maintenant trouvez l'emoji...",
    invalidLevel: "Erreur: Niveau invalide",
    itemNotFound: "Erreur: Élément non trouvé",
    correct: "Vous avez réussi!",
    excellent: "🎉 Excellent!",
    nextScreen: "Passage à l'écran suivant",
    knowCapitals: "🎉 Vous connaissez les capitales!",
    confirmExit: "Voulez-vous quitter?",
    loseProgress: "Vous perdrez la progression actuelle du jeu",
    cancel: "ANNULER",
    confirm: "CONFIRMER",
    gameOverMovie: "🌬️ Le rideau est tombé!",
    gameOverLives: "💔 Les vies sont finies!",
    tryAgain: "Essayons encore...",
    studyGeography: "🗺️ Il est temps d'étudier la géographie!",
    tryAgainGeo: "Essayez encore...",
    congratulations: "Félicitations!",
    completedAllScreens: "Vous avez terminé tous les écrans!",
    clearProgress: "Effacer Progression",
    recoverLives: "Récupérez vos vies",
    nextFreeRetry: "Nouvel essai dans",
    adBlockerTitle: "Bloqueur de publicités détecté",
    adBlockerMessage: "Ce jeu est gratuit grâce aux publicités. Veuillez désactiver votre bloqueur pour continuer.",
    adBlockerButton: "Je l'ai désactivé, continuer",
    aboutTitle: "Qu'est-ce qu'Imaginalo ?",
    aboutText: "Imaginalo est un jeu de devinettes visuelles où vous devez identifier des films, des logos, des silhouettes, des emojis, des drapeaux et plus encore à partir d'images. Il contient des centaines de niveaux organisés en catégories pour tous les goûts.",
    howToPlayTitle: "Comment jouer ?",
    howToPlayText: "Choisissez une catégorie, regardez l'image ou l'emoji et tapez votre réponse. Si vous ne savez pas, passez au niveau suivant et revenez plus tard. Chaque catégorie a des dizaines de niveaux avec une difficulté croissante.",
  },
};

translations.es_sp = { ...translations.es };

export type SupportedLanguage = "es" | "es_sp" | "en";

export const getLanguageByCountry = (
  countryCode: string,
): SupportedLanguage => {
  const languageMap: Record<string, SupportedLanguage> = {
    // Spanish speaking countries
    AR: "es",
    MX: "es",
    CO: "es",
    PE: "es",
    CL: "es",
    VE: "es",
    BO: "es",
    PY: "es",
    UY: "es",
    ES: "es_sp",
    EC: "es",
    GT: "es",
    HN: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    DO: "es",
    CU: "es",

    // English speaking countries (fallback for others)
    US: "en",
    GB: "en",
    AU: "en",
    CA: "en",
    IE: "en",
    NZ: "en",
    ZA: "en",
    IN: "en",
    SG: "en",
    MY: "en",
    PH: "en",
    NG: "en",
    KE: "en",
    GH: "en",
    UG: "en",
  };

  return languageMap[countryCode] || "en";
};
