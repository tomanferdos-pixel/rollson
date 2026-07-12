"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

type MailMessage = {
  id: string;
  subject: string;
  from?: string;
  receivedAt?: string;
  code: string | null;
  bodyPreview: string;
  bodyText: string;
  bodyHtml: string;
};

type QueryResult =
  | {
      ok: true;
      email: string;
      cdKeyExpiresAt: string | null;
      count: number;
      windowMinutes?: number;
      messages: MailMessage[];
      message?: string;
    }
  | {
      ok: false;
      message?: string;
    };

/** Poll while inbox is open — under rate limit (30/min). */
const POLL_INTERVAL_MS = 8_000;

function sanitizeHtml(html: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><base target="_blank"/><style>
    body{margin:16px;font-family:Inter,system-ui,sans-serif;background:#222;color:#ececec;word-break:break-word;}
    a{color:#bdbdbd}
    img{max-width:100%;height:auto}
  </style></head><body>${html}</body></html>`;
}

export default function InboxConsole() {
  const { t } = useLanguage();
  const [cdKey, setCdKey] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const inFlight = useRef(false);

  const fetchInbox = useCallback(
    async (key: string, mode: "open" | "poll") => {
      if (inFlight.current) return;
      inFlight.current = true;
      if (mode === "open") {
        setLoading(true);
        setResult(null);
        setCopiedId(null);
        setExpanded({});
      } else {
        setRefreshing(true);
      }

      try {
        const res = await fetch("/api/query", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cdKey: key }),
          cache: "no-store",
        });
        const data = (await res.json()) as QueryResult;
        setResult(data);
        setLastCheckedAt(new Date());
        if (data.ok) {
          setActiveKey(key);
        } else if (mode === "open") {
          setActiveKey(null);
        }
      } catch {
        if (mode === "open") {
          setResult({ ok: false, message: t("main.networkError") });
          setActiveKey(null);
        }
        // On poll failure keep last good result
      } finally {
        inFlight.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [t],
  );

  async function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    const key = cdKey.trim();
    if (!key) return;
    await fetchInbox(key, "open");
  }

  // Auto-refresh while a valid inbox is open
  useEffect(() => {
    if (!activeKey || !result?.ok) return;

    const tick = () => {
      if (document.visibilityState === "hidden") return;
      void fetchInbox(activeKey, "poll");
    };

    const id = window.setInterval(tick, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchInbox(activeKey, "poll");
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [activeKey, result?.ok, fetchInbox]);

  async function copyCode(code: string, id: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement("textarea");
        el.value = code;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((cur) => (cur === id ? null : cur));
      }, 1600);
    } catch {
      alert(t("main.copyFailed"));
    }
  }

  const hasMessages = !!(result && result.ok && result.messages?.length);
  const daysLeft =
    result && result.ok && result.cdKeyExpiresAt
      ? Math.max(0, Math.ceil((new Date(result.cdKeyExpiresAt).getTime() - Date.now()) / 864e5))
      : null;

  return (
    <main className="app-shell unified-2026-page">
      <Header active="inbox" />
      <section className="inbox-center container">
        <section className="mail-console inbox-console" id="inbox" aria-label="Mailbox query console">
          <div className="console-header">
            <div>
              <p className="label">{t("main.badge")}</p>
              <div className="console-title-row">
                <img
                  className="console-avatar"
                  src="/ROLLSON.png"
                  alt="Rollson"
                  width={56}
                  height={56}
                />
                <h1>{t("main.title")}</h1>
              </div>
              <p className="console-intro">{t("main.intro")}</p>
            </div>
          </div>

          <form className="mailbox-form" onSubmit={onSubmit}>
            <div className="email-input-wrap">
              <span className="input-icon">@</span>
              <input
                className="email-input"
                type="text"
                placeholder="MG-XXXXX-XXXXX-XXXXX-XXXXX"
                required
                value={cdKey}
                onChange={(e) => setCdKey(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button className="primary-btn" disabled={loading || !cdKey.trim()} type="submit">
              {loading ? t("main.checking") : t("main.openInbox")}
            </button>
          </form>

          {result && !result.ok ? (
            <div className="notice error" role="alert">
              {result.message || t("main.queryFailed")}
            </div>
          ) : null}

          {result?.ok ? (
            <div className="inbox-area">
              <div className="inbox-live-bar" aria-live="polite">
                <span className={`live-dot${refreshing ? " is-pulse" : ""}`} aria-hidden="true" />
                <span>
                  {refreshing ? t("main.autoRefreshing") : t("main.autoRefreshOn")}
                  {lastCheckedAt
                    ? ` · ${t("main.lastChecked", {
                        time: lastCheckedAt.toLocaleTimeString(),
                      })}`
                    : ""}
                </span>
                <button
                  type="button"
                  className="live-refresh-btn"
                  disabled={refreshing || loading}
                  onClick={() => activeKey && void fetchInbox(activeKey, "poll")}
                >
                  {t("main.refreshNow")}
                </button>
              </div>

              <div className="inbox-summary">
                <div>
                  <span className="label">{t("main.mailbox")}</span>
                  <strong>{result.email}</strong>
                </div>
                <div>
                  <span className="label">{t("main.messages")}</span>
                  <strong>{result.count}</strong>
                </div>
                <div>
                  <span className="label">{t("main.keyExpires")}</span>
                  <strong>
                    {result.cdKeyExpiresAt
                      ? new Date(result.cdKeyExpiresAt).toLocaleDateString("en-US")
                      : "—"}
                  </strong>
                </div>
                <div>
                  <span className="label">{t("main.daysLeft")}</span>
                  <strong>{daysLeft === null ? "—" : `${daysLeft} days`}</strong>
                </div>
              </div>

              {!hasMessages ? (
                <div className="empty-state compact">
                  <div className="empty-icon">0</div>
                  <h3>{t("main.noRecentMail")}</h3>
                  <p>{t("main.noRecentMailText")}</p>
                  <p className="auto-wait-hint">{t("main.autoWaitHint")}</p>
                </div>
              ) : (
                result.messages.map((msg) => (
                  <article key={msg.id} className="message-card">
                    <div className="message-topline">
                      <h3>{msg.subject || "(no subject)"}</h3>
                      {msg.receivedAt ? (
                        <time dateTime={msg.receivedAt}>
                          {new Date(msg.receivedAt).toLocaleString()}
                        </time>
                      ) : null}
                    </div>
                    {msg.from ? <p className="sender">{msg.from}</p> : null}

                    {msg.code ? (
                      <div className="code-strip">
                        <div>
                          <span className="label">{t("main.verificationCode")}</span>
                          <strong className="code-value">{msg.code}</strong>
                        </div>
                        <button
                          type="button"
                          className="copy-code-btn"
                          onClick={() => copyCode(msg.code!, msg.id)}
                        >
                          {copiedId === msg.id ? t("main.copied") : t("main.copy")}
                        </button>
                      </div>
                    ) : null}

                    <p className="message-preview">{msg.bodyPreview || t("main.noBodyPreview")}</p>

                    <button
                      type="button"
                      className="full-email-toggle"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                      }
                    >
                      {expanded[msg.id] ? t("main.hideFullEmail") : t("main.viewFullEmail")}
                    </button>

                    {expanded[msg.id] ? (
                      <div className="full-email-panel">
                        <p className="full-email-hint">{t("main.originalEmailHint")}</p>
                        <div className="full-email-view">
                          {msg.bodyHtml ? (
                            <iframe
                              className="full-email-frame"
                              title={`Full email: ${msg.subject || ""}`}
                              srcDoc={sanitizeHtml(msg.bodyHtml)}
                              sandbox="allow-popups allow-popups-to-escape-sandbox"
                            />
                          ) : (
                            <pre className="full-email-body">
                              {msg.bodyText || msg.bodyPreview || t("main.noFullEmail")}
                            </pre>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          ) : !result ? (
            <div className="empty-state">
              <div className="empty-icon">@</div>
              <h3>{t("main.ready")}</h3>
              <p>{t("main.readyText")}</p>
            </div>
          ) : null}
        </section>
      </section>
      <Footer />
    </main>
  );
}
