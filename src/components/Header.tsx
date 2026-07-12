"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { APP_NAME } from "@/lib/config";

type Props = {
  active?: "inbox" | "about" | "status";
  className?: string;
};

export default function Header({ active = "inbox", className }: Props) {
  const { t } = useLanguage();

  return (
    <header className={className || "topbar has-centered-name"}>
      <Link className="brand" href="/" aria-label={`${APP_NAME} home`}>
        <span className="brand-mark brand-mark-image">
          <Image src="/brand-icon.png" alt={`${APP_NAME} icon`} width={32} height={32} />
        </span>
        <span className="brand-word">{APP_NAME}</span>
      </Link>
      <div className="topbar-center-name" aria-label="Site brand">
        {APP_NAME}
      </div>
      <nav className="top-actions" aria-label="Primary navigation">
        <LanguageSwitcher />
        {active !== "about" ? (
          <Link className="about-nav-link" href="/about">
            {t("nav.about")}
          </Link>
        ) : (
          <Link className="about-nav-link" href="/">
            {t("nav.inbox")}
          </Link>
        )}
        {active !== "status" ? (
          <Link className="nav-link strong" href="/status">
            {t("nav.status")}
          </Link>
        ) : (
          <Link className="nav-link strong" href="/">
            {t("nav.inbox")}
          </Link>
        )}
      </nav>
    </header>
  );
}
