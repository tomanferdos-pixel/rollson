import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveKey } from "@/lib/keys";
import { queryMailbox } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { queryUpstream, UPSTREAM_ENABLED } from "@/lib/upstream";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  cdKey: z.string().min(4).max(128),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const limited = checkRateLimit(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Rate limit exceeded. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid CD key format" }, { status: 400 });
  }

  const cdKey = parsed.data.cdKey;

  // 1) Prefer live Popcorn backend so production keys (MG-...) keep working.
  if (UPSTREAM_ENABLED) {
    try {
      const upstream = await queryUpstream(cdKey);
      if (upstream && typeof upstream === "object") {
        return NextResponse.json(upstream);
      }
    } catch {
      // fall through to local store
    }
  }

  // 2) Local / demo keys (data/keys.json or KEYS_JSON)
  const resolved = await resolveKey(cdKey);
  if (!resolved) {
    return NextResponse.json({ ok: false, message: "This CD key is invalid or disabled" });
  }

  const result = await queryMailbox(resolved.record);
  return NextResponse.json(result);
}
