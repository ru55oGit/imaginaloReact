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
// game.tsx:getEntriesByCategoryAndLanguage). Sólo queda afuera ACERTIJOS:
// son acertijos visuales atados a juegos de palabras en español/inglés, sin
// equivalente natural en pt. El resto (ESCUDOS, BANDERAS, LOGOS, FUNKOS,
// SOMBRAS, PELICULAS, EMOJIS) tiene su propio dataset _pt.json, con los
// nombres/títulos oficiales de Brasil investigados uno por uno (no una
// traducción literal — ej. "Volver al Futuro" -> "De Volta para o Futuro",
// "El Pájaro Loco" -> "Pica-Pau").
export const PT_UNAVAILABLE_CATEGORIES = new Set([
  ACERTIJOS,
])
