# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Added
- Home: si se llega desde el hub "Boludeando" (`?from=boludeando`, ahora en www.boludeando.com), se muestra un header blanco real arriba del título (mismo estilo que el header del juego, ya no una cajita flotante que podía pisarse con el título) con flecha para volver. Queda persistido en localStorage para siempre en ese dispositivo — si alguien comparte la URL directa sin pasar por el hub, no aparece
### Changed
- Política de Privacidad: agregar sección de Google Analytics (el sitio carga gtag.js pero no estaba declarado, solo se mencionaba AdSense) y actualizar la fecha de última actualización (junio 2025 → agosto 2026)
- AdSense: sacar el script del `index.html` (se cargaba en todo el sitio) y cargarlo solo desde Home y Privacidad (componente `AdsenseScript`) — nunca en `/game` ni `/levels`, pantallas de juego sin texto. Mismo fix que en Enganchalo, que Google rechazó por "anuncios servidos por Google en pantallas sin contenido del editor"
- Home: agregar emoji de momento del día al saludo (☀️/🌤️/🌙), mismo tratamiento que ya tenía Enganchalo

### Fixed
- Header: tocar el título (para volver a Home) seleccionaba el texto en mobile y disparaba el popup de "Buscar en Google" del navegador — agregar `userSelect: none`

## [2026-07-26]
### Added
- SEO: agregar contenido descriptivo único por categoría
- SEO: agregar robots.txt y sitemap.xml (faltaban)

## [2026-07-25]
### Changed
- Home: categorías en 2 columnas en vez de 3 (desktop y mobile)

## [2026-07-24]
### Changed
- Home: normalizar fuentes/spacing/box a como el resto de la familia
### Fixed
- Fix: columna central angosta en desktop (480px fijo en vez de 40vw)

## [2026-07-20]
### Removed
- AdSense: sacar el anuncio del modal de "sin vidas" y agregar ads.txt

## [2026-07-12]
### Added
- Agregar favicon (mismo estilo que Sopalo)

## [2026-07-09]
### Added
- Botón de jugar: agregar ícono de play y sombra para que resalte más

## [2026-07-07]
### Added
- SEO: agregar contenido noscript para crawlers de AdSense

## [2026-06-29]
### Added
- Analytics: agregar Google Analytics G-GYNM7P6756
### Changed
- PrivacyPolicy: actualizar mail de contacto a patricio.ezequiel.toledo@gmail.com
- Home: traducir secciones '¿Qué es?' y '¿Cómo jugar?' al idioma activo

## [2026-06-28]
### Changed
- AdSense: SEO, política de privacidad y contenido descriptivo

## [2026-06-19]
### Changed
- Optimización de chunks con manualChunks

## [2026-06-18]
### Changed
- title
- Home
- Home

## [2026-06-10]
### Changed
- ADBlock
- AdBlock
- AdSense
- Adsense
- titulo aleatorios

## [2026-06-08]
### Changed
- Separacion en silabas
- modificaciones en el progreso

## [2026-06-04]
### Changed
- Niveles aleatorios
- Aleatorios
- Performance
- Deploy
- Redesign

## [2026-06-02]
### Changed
- Categories
- Redesign home

## [2026-05-15]
### Fixed
- fix: alinear bloque Como Jugar y boton Jugar al fondo de la pantalla

## [2026-04-18]
### Changed
- Initial commit
