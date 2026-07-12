"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingTools from "@/components/FloatingTools";
import { useLanguage } from "@/components/LanguageProvider";
import { APP_NAME } from "@/lib/config";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="about-store-page unified-2026-page">
      <Header active="about" className="about-store-topbar has-centered-name" />
      <section className="container about-store-hero">
        <p className="label about-badge">{t("about.badge")}</p>
        <h1>
          {t("about.titlePrefix")} <span>{APP_NAME}</span>
        </h1>
        <p className="about-intro">{t("about.intro")}</p>
        <ul className="about-pill-list">
          <li>{t("about.premiumQuality")}</li>
          <li>{t("about.secureService")}</li>
          <li>{t("about.customerGuarantee")}</li>
        </ul>
      </section>

      <section className="container about-stats">
        <article className="about-stat-card">
          <strong>500+</strong>
          <h3>{t("about.positiveReviews")}</h3>
          <p>{t("about.reviewsText")}</p>
        </article>
        <article className="about-stat-card">
          <span className="about-stat-kicker">{t("about.premium")}</span>
          <h3>{t("about.serviceQuality")}</h3>
          <p>{t("about.qualityText")}</p>
        </article>
        <article className="about-stat-card">
          <span className="about-stat-kicker">{t("about.guaranteed")}</span>
          <h3>{t("about.customerConfidence")}</h3>
          <p>{t("about.guaranteeText")}</p>
        </article>
      </section>

      <section className="container about-story">
        <p className="label">{t("about.commitment")}</p>
        <h2>{t("about.storyTitle")}</h2>
        <p>{t("about.storyP1")}</p>
        <p>{t("about.storyP2")}</p>
      </section>

      <section className="container about-support">
        <div className="about-support-head">
          <p className="label">{t("about.supportHours")}</p>
          <h2>{t("about.hereToHelp")}</h2>
        </div>
        <div className="about-support-grid">
          <article className="about-support-card">
            <h3>
              🇲🇦 {t("about.moroccoTime")}
            </h3>
            <p>10:00 AM – 12:00 PM</p>
            <p>4:00 PM – 10:00 PM</p>
          </article>
          <article className="about-support-card">
            <h3>
              🇷🇺 {t("about.moscowTime")}
            </h3>
            <p>12:00 PM – 2:00 PM</p>
            <p>6:00 PM – 12:00 AM</p>
          </article>
        </div>
        <p className="about-support-note">{t("about.supportNote")}</p>
      </section>

      <section className="container about-final">
        <h2>★★★★★ {t("about.finalTitle")}</h2>
        <p>{t("about.finalText")}</p>
      </section>

      <Footer />
      <FloatingTools />
    </main>
  );
}
