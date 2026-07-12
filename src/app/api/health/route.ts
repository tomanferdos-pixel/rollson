import { NextResponse } from "next/server";
import { APP_VERSION, MAIL_WINDOW_MINUTES, RATE_LIMIT_PER_MINUTE } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: APP_VERSION,
    time: new Date().toISOString(),
    mailWindowMinutes: MAIL_WINDOW_MINUTES,
    rateLimitPerMinute: RATE_LIMIT_PER_MINUTE,
  });
}
