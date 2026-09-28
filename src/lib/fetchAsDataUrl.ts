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
