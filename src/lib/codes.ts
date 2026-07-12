/** Extract likely verification codes from email subject/body. */
export function extractVerificationCode(...parts: Array<string | null | undefined>): string | null {
  const text = parts.filter(Boolean).join("\n");
  if (!text) return null;

  const patterns = [
    /\b(\d{6})\b/,
    /\b(\d{4,8})\b/,
    /\b([A-Z0-9]{4}-[A-Z0-9]{4})\b/i,
    /(?:code|код|otp|pin)[^\w]{0,12}([A-Z0-9]{4,8})/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}
