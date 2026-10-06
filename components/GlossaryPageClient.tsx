"use client";
import { Breadcrumbs } from "@/components/ui";
import GlossaryBrowser, { type GlossaryEntry } from "@/components/GlossaryBrowser";
import { useLanguage } from "@/lib/i18n";

export default function GlossaryPageClient({ terms }: { terms: GlossaryEntry[] }) {
  const { t } = useLanguage();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: t("mobile.home"), href: "/" }, { label: t("glossary.title") }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">A – Z</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("glossary.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          {t("glossary.subtitle")}
        </p>
      </header>
      <GlossaryBrowser terms={terms} />
    </div>
  );
}
