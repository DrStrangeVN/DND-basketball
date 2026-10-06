"use client";
import type { HubMeta, HubGroup } from "@/lib/hubs";
import { hubText, hubGroupText } from "@/lib/hubs";
import type { Article } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { Breadcrumbs, SectionTitle } from "./ui";
import { KnowledgeCard } from "./cards";
import HubIcon from "./HubIcon";

export default function HubViewClient({ hub, groupsData, groupId, showGroupTitles }: {
  hub: HubMeta;
  groupsData: { group: HubGroup; articles: Article[] }[];
  groupId?: string;
  showGroupTitles: boolean;
}) {
  const { lang, t } = useLanguage();
  const single = groupsData[0]?.group;

  return (
    <div className="pb-6">
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("nav.learn"), href: "/learn" },
        ...(groupId && single ? [{ label: hubText(hub, lang, "title"), href: hub.route }] : []),
        { label: groupId && single ? hubGroupText(single, lang, "title") : hubText(hub, lang, "title") },
      ]} />

      <header className="neu mb-8 flex items-start gap-4 p-6 sm:p-8">
        <span className="neu-sm flex h-14 w-14 shrink-0 items-center justify-center">
          <HubIcon icon={hub.icon} className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">{hubText(hub, lang, "tagline")}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {groupId && single ? hubGroupText(single, lang, "title") : hubText(hub, lang, "title")}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted)]">
            {groupId && single ? hubGroupText(single, lang, "description") : hubText(hub, lang, "description")}
          </p>
        </div>
      </header>

      {groupsData.map(({ group: g, articles }) => (
        <section key={g.id} className="mb-10" aria-labelledby={`g-${g.id}`}>
          {showGroupTitles && (
            <div id={`g-${g.id}`}>
              <SectionTitle title={hubGroupText(g, lang, "title")} description={hubGroupText(g, lang, "description")}
                href={hub.id === "skills" ? `/skills/${g.id}` : undefined} />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
