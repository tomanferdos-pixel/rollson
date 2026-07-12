"use client";

import { useLanguage } from "./LanguageProvider";
import { APP_NAME } from "@/lib/config";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <p className="site-footer-text">
        © {new Date().getFullYear()} {t("common.rights")}{" "}
        <span className="footer-owner-link">{APP_NAME}</span>
      </p>
    </footer>
  );
}
