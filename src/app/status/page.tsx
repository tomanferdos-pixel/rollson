"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

type Health = {
  ok: boolean;
  version?: string;
  time?: string;
  mailWindowMinutes?: number;
  rateLimitPerMinute?: number;
};

export default function StatusPage() {
  const { t } = useLanguage();
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = (await res.json()) as Health;
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setHealth({ ok: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const online = health?.ok === true;
  const windowMin = health?.mailWindowMinutes ?? 10;
  const rate = health?.rateLimitPerMinute ?? 30;

  return (
    <main className="status-shell unified-2026-page">
      <Header active="status" />
      <section className="container status-panel">
        <p className="label">{t("status.systemStatus")}</p>
        <h1>{t("status.overview")}</h1>

        <div className="status-grid">
          <article className="status-card">
            <span className="label">{t("status.online")}</span>
            <strong className={online ? "status-ok" : "status-bad"}>
              {online ? t("status.online") : "Offline"}
            </strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.version")}</span>
            <strong>{health?.version || "—"}</strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.mailWindow")}</span>
            <strong>{t("status.minutes", { value: windowMin })}</strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.rateLimit")}</span>
            <strong>{t("status.requestsPerMinute", { value: rate })}</strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.checkedAt")}</span>
            <strong>{health?.time || "—"}</strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.healthApi")}</span>
            <strong>/api/health</strong>
          </article>
          <article className="status-card">
            <span className="label">{t("status.runtime")}</span>
            <strong>{t("status.nextServer")}</strong>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
