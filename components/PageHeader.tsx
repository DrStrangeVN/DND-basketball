"use client";
import { Breadcrumbs } from "./ui";
import { useLanguage } from "@/lib/i18n";

export default function PageHeader({ crumbs, eyebrowKey, titleKey, descKey }: {
  crumbs: { labelKey: string; href?: string }[];
  eyebrowKey?: string;
  titleKey: string;
  descKey?: string;
}) {
  const { t } = useLanguage();
  return (
    <>
      <Breadcrumbs items={crumbs.map((c) => ({ label: t(c.labelKey), href: c.href }))} />
      <header className="neu mb-6 p-6 sm:p-8">
        {eyebrowKey && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">{t(eyebrowKey)}</p>
        )}
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{t(titleKey)}</h1>
        {descKey && <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">{t(descKey)}</p>}
      </header>
    </>
  );
}
