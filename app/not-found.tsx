"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="neu p-10">
        <p className="text-6xl font-extrabold text-[color:var(--orange)]">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{t("notFound.title")}</h1>
        <p className="mt-2 text-[15px] text-[color:var(--muted)]">
          {t("notFound.desc")}
        </p>
        <Link href="/" className="neu-btn mt-6 inline-flex items-center gap-2 bg-[color:var(--orange)] px-6 py-3 text-[15px] font-bold text-white">
          {t("common.goHome")} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
