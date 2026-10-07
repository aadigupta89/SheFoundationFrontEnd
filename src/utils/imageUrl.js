const backendOrigin = "https://shefoundationbackend.onrender.com";

export default function resolveImageUrl(imageUrl) {
  if (!imageUrl) return imageUrl;

  try {
    const url = new URL(imageUrl, backendOrigin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      url.origin = backendOrigin;
    }
    return url.href;
  } catch {
    return imageUrl;
  }
}