export const ACERTIJOS = 'acertijos'
export const EMOJIS = 'emojis'
export const LOGOS = 'logos'
export const PELICULAS = 'peliculas'
// export const JUGADORES = 'jugadores'
export const SOMBRAS = 'sombras'
export const FUNKOS = 'funkos'
export const ESCUDOS = 'escudos'
export const BANDERAS = 'banderas'
export const ALEATORIO = 'aleatorio'
export const QUESTIONS = 'preguntas'

// Categorías sin datos en portugués (ver src/data/*_pt.json y
// game.tsx:getEntriesByCategoryAndLanguage): ACERTIJOS son acertijos
// visuales atados a juegos de palabras en español/inglés; PELICULAS y
// EMOJIS son títulos de películas (los nombres oficiales en pt-BR suelen
// ser completamente distintos, no una traducción literal — ej. "Volver al
// Futuro" -> "De Volta para o Futuro"); SOMBRAS son en su mayoría personajes
// de dibujos con nombre de doblaje propio en cada idioma (ej. "El Pájaro
// Loco" -> "Pica-Pau"). Reusar el dataset en español ahí sería mostrarle
// contenido no traducido a un jugador de pt. ESCUDOS, BANDERAS, LOGOS y
// FUNKOS sí quedan habilitadas (nombres propios, o con dataset _pt.json
// propio en el caso de banderas/escudos).
export const PT_UNAVAILABLE_CATEGORIES = new Set([
  ACERTIJOS,
  PELICULAS,
  EMOJIS,
  SOMBRAS,
])
