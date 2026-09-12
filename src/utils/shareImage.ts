// Convierte el <svg> del acertijo (son componentes SVG, no fotos) a un PNG
// para poder adjuntarlo con navigator.share({ files: [...] }). Se serializa
// el SVG ya renderizado en vez de volver a pedir el asset, así funciona
// para cualquier categoría sin depender de tener una URL de imagen real.
export async function captureSvgAsPngFile(
  container: HTMLElement | null,
  filename: string,
): Promise<File | null> {
  if (!container) return null;
  const svg = container.querySelector("svg");
  if (!svg) return null;

  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || svg.clientWidth || 400));
  const height = Math.max(1, Math.round(rect.height || svg.clientHeight || 400));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  try {
    const image = await loadImage(svgDataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fondo blanco: el SVG puede no tener uno propio y el share quedaría
    // con transparencia rara en apps que no la manejan bien.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return null;

    return new File([blob], filename, { type: "image/png" });
  } catch {
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
