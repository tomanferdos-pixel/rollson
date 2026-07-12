"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

function ThemeIcon({ type }: { type: "sun" | "moon" }) {
  if (type === "sun") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

export default function FloatingTools() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("rollson-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved === "dark" || (!saved && prefersDark);
    setDark(next);
    document.documentElement.classList.toggle("dark-mode", next);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark-mode", next);
    window.localStorage.setItem("rollson-theme", next ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("rollson-theme-change"));
  }

  return (
    <div className="floating-contact-bar" aria-label="Theme">
      <button
        type="button"
        className="floating-contact-btn theme-toggle"
        onClick={toggle}
        aria-label={dark ? t("floating.switchLight") : t("floating.switchDark")}
      >
        <span className="floating-icon">
          <ThemeIcon type={dark ? "sun" : "moon"} />
        </span>
        <span className="floating-tooltip">
          {dark ? t("floating.lightMode") : t("floating.darkMode")}
        </span>
      </button>
    </div>
  );
}
