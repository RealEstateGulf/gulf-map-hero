// Resolves a (possibly cross-origin) image URL to a data: URL so it can be
// embedded in a canvas/PDF render without tainting it or depending on the
// remote host's CORS headers at render time. A failed fetch just resolves to
// undefined so callers can drop that one image instead of failing entirely.
export async function fetchAsDataUrl(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

// react-pdf (pdfkit under the hood) can only embed JPEG/PNG image data — it
// can't parse WebP, which is what every photo in storage now is after the
// bulk re-optimization pass. This re-decodes via an offscreen <canvas> (data:
// URLs never taint it, regardless of the source's CORS headers) and
// re-encodes as JPEG so the PDF brochure can still embed the photo.
export async function fetchAsJpegDataUrl(url: string): Promise<string | undefined> {
  const dataUrl = await fetchAsDataUrl(url);
  if (!dataUrl) return undefined;
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/png')) return dataUrl;
  try {
    const img = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('image decode failed'));
    });
    img.src = dataUrl;
    await loaded;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch {
    return undefined;
  }
}
