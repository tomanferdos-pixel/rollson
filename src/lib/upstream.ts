/**
 * Forward CD-key queries to the live Popcorn / Mar One backend so existing keys keep working.
 */
export const UPSTREAM_QUERY_URL =
  process.env.UPSTREAM_QUERY_URL || "https://popcornofficial.com/api/query";

export const UPSTREAM_ENABLED = (process.env.UPSTREAM_ENABLED ?? "true").toLowerCase() !== "false";

export async function queryUpstream(cdKey: string): Promise<unknown | null> {
  if (!UPSTREAM_ENABLED || !UPSTREAM_QUERY_URL) return null;

  const res = await fetch(UPSTREAM_QUERY_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": "Rollson-Proxy/1.0",
    },
    body: JSON.stringify({ cdKey }),
    cache: "no-store",
  });

  // Upstream may return 200 with ok:false for bad keys — still pass through.
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {
      ok: false,
      message: `Upstream error (${res.status})`,
    };
  }
}
