import { extractVerificationCode } from "./codes";
import type { KeyRecord } from "./keys";
import { MAIL_WINDOW_MINUTES } from "./config";

export type MailMessage = {
  id: string;
  subject: string;
  from?: string;
  receivedAt?: string;
  code: string | null;
  bodyPreview: string;
  bodyText: string;
  bodyHtml: string;
};

export type QuerySuccess = {
  ok: true;
  email: string;
  cdKeyExpiresAt: string | null;
  count: number;
  windowMinutes: number;
  messages: MailMessage[];
};

function demoMessages(email: string): MailMessage[] {
  const now = Date.now();
  const samples = [
    {
      subject: "Your verification code",
      code: "482917",
      body: "Use this code to continue: 482917\nIt expires in 10 minutes.",
    },
    {
      subject: "Security code",
      code: "731045",
      body: "Your one-time code is 731045.",
    },
  ];

  return samples.map((s, i) => ({
    id: `demo-${i + 1}`,
    subject: s.subject,
    from: "noreply@service.example",
    receivedAt: new Date(now - i * 90_000).toISOString(),
    code: s.code,
    bodyPreview: s.body.slice(0, 160),
    bodyText: s.body,
    bodyHtml: `<p>${s.body.replace(/\n/g, "<br/>")}</p><p style="color:#6b7280">Demo mailbox for ${email}</p>`,
  }));
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const tenant = process.env.MS_TENANT_ID || "common";
  if (!clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: "https://graph.microsoft.com/Mail.Read offline_access",
  });

  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token || null;
}

async function fetchGraphMessages(accessToken: string): Promise<MailMessage[]> {
  const since = new Date(Date.now() - MAIL_WINDOW_MINUTES * 60_000).toISOString();
  const filter = encodeURIComponent(`receivedDateTime ge ${since}`);
  const select = encodeURIComponent("id,subject,from,receivedDateTime,bodyPreview,body");
  const url =
    `https://graph.microsoft.com/v1.0/me/messages?$top=20&$orderby=receivedDateTime desc` +
    `&$filter=${filter}&$select=${select}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    value?: Array<{
      id: string;
      subject?: string;
      from?: { emailAddress?: { address?: string; name?: string } };
      receivedDateTime?: string;
      bodyPreview?: string;
      body?: { contentType?: string; content?: string };
    }>;
  };

  return (data.value || []).map((m) => {
    const subject = m.subject || "(no subject)";
    const preview = m.bodyPreview || "";
    const content = m.body?.content || "";
    const isHtml = (m.body?.contentType || "").toLowerCase() === "html";
    const bodyText = isHtml ? content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : content;
    const bodyHtml = isHtml ? content : `<pre>${content}</pre>`;
    const code = extractVerificationCode(subject, preview, bodyText);

    return {
      id: m.id,
      subject,
      from: m.from?.emailAddress?.address || m.from?.emailAddress?.name,
      receivedAt: m.receivedDateTime,
      code,
      bodyPreview: preview || bodyText.slice(0, 160),
      bodyText,
      bodyHtml,
    };
  });
}

export async function queryMailbox(record: KeyRecord): Promise<QuerySuccess | { ok: false; message: string }> {
  if (record.enabled === false) {
    return { ok: false, message: "This CD key is invalid or disabled" };
  }

  if (record.expiresAt) {
    const exp = new Date(record.expiresAt).getTime();
    if (!Number.isNaN(exp) && exp < Date.now()) {
      return { ok: false, message: "This CD key has expired" };
    }
  }

  // Demo keys or missing Graph setup
  if (record.demo || !record.refreshToken) {
    if (record.demo) {
      const messages = demoMessages(record.email);
      return {
        ok: true,
        email: record.email,
        cdKeyExpiresAt: record.expiresAt || null,
        count: messages.length,
        windowMinutes: MAIL_WINDOW_MINUTES,
        messages,
      };
    }
    return {
      ok: false,
      message: "Mailbox is not linked yet. Contact support to activate this key.",
    };
  }

  const accessToken = await refreshAccessToken(record.refreshToken);
  if (!accessToken) {
    return { ok: false, message: "Unable to authorize mailbox. Try again later." };
  }

  const messages = await fetchGraphMessages(accessToken);
  return {
    ok: true,
    email: record.email,
    cdKeyExpiresAt: record.expiresAt || null,
    count: messages.length,
    windowMinutes: MAIL_WINDOW_MINUTES,
    messages,
  };
}
