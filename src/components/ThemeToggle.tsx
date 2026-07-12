"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

function ThemeIcon({ type }: { type: "sun" | "moon" }) {
  if (type === "sun") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
      <path
        d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ThemeToggle() {
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
    <button
      type="button"
      className="theme-toggle-header"
      onClick={toggle}
      aria-label={dark ? t("floating.switchLight") : t("floating.switchDark")}
      title={dark ? t("floating.lightMode") : t("floating.darkMode")}
    >
      <ThemeIcon type={dark ? "sun" : "moon"} />
    </button>
  );
}
