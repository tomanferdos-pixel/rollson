"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { APP_NAME } from "@/lib/config";

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <header className={className || "topbar has-centered-name"}>
      <Link className="brand" href="/" aria-label={`${APP_NAME} home`}>
        <span className="brand-mark brand-mark-image">
          <Image src="/brand-icon.png" alt={`${APP_NAME} icon`} width={32} height={32} />
        </span>
        <span className="brand-word">{APP_NAME}</span>
      </Link>
      <div className="topbar-center-name" aria-label="Site brand">
        FunPay
      </div>
      <nav className="top-actions" aria-label="Primary navigation">
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
