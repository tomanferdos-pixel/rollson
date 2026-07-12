"use client";

import { LOCALE_OPTIONS } from "@/i18n/messages";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const current = LOCALE_OPTIONS.find((l) => l.code === locale) ?? LOCALE_OPTIONS[0];

  return (
    <details className="language-switcher">
      <summary className="language-switcher-trigger" aria-label="Choose language">
        <span aria-hidden="true">🌐</span>
        <strong>{current.short}</strong>
        <span className="language-chevron" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="language-menu" role="menu">
        {LOCALE_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            type="button"
            className={locale === opt.code ? "language-option active" : "language-option"}
            onClick={(e) => {
              setLocale(opt.code);
              const details = (e.currentTarget as HTMLElement).closest("details");
              details?.removeAttribute("open");
            }}
          >
            <span className="language-flag" aria-hidden="true">
              {opt.flag}
            </span>
            <span>{opt.name}</span>
            {locale === opt.code ? (
              <span className="language-check" aria-hidden="true">
                ✓
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </details>
  );
}
