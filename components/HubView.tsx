import { getArticlesByHub, getArticlesByGroup } from "@/lib/content";
import { hubById } from "@/lib/hubs";
import { notFound } from "next/navigation";
import { Breadcrumbs, SectionTitle } from "./ui";
import { KnowledgeCard } from "./cards";
import HubIcon from "./HubIcon";

export default function HubView({ hubId, groupId }: { hubId: string; groupId?: string }) {
  const hub = hubById(hubId);
  if (!hub) notFound();
  const groups = groupId ? hub.groups.filter((g) => g.id === groupId) : hub.groups;
  if (groupId && groups.length === 0) notFound();
  const single = groups[0];
  const showGroupTitles = !groupId && hub.groups.length > 1;

  return (
    <div className="pb-6">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Learn", href: "/learn" },
        ...(groupId ? [{ label: hub.title, href: hub.route }] : []),
        { label: groupId ? single.title : hub.title },
      ]} />

      <header className="neu mb-8 flex items-start gap-4 p-6 sm:p-8">
        <span className="neu-sm flex h-14 w-14 shrink-0 items-center justify-center">
          <HubIcon icon={hub.icon} className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">{hub.tagline}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {groupId ? single.title : hub.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted)]">
            {groupId ? single.description : hub.description}
          </p>
        </div>
      </header>

      {groups.map((g) => {
        const articles = getArticlesByGroup(hubId, g.id);
        if (articles.length === 0) return null;
        return (
          <section key={g.id} className="mb-10" aria-labelledby={`g-${g.id}`}>
            {showGroupTitles && (
              <div id={`g-${g.id}`}>
                <SectionTitle title={g.title} description={g.description}
                  href={hubId === "skills" ? `/skills/${g.id}` : undefined} />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function GroupArticles({ hubId, groupId }: { hubId: string; groupId: string }) {
  return <HubView hubId={hubId} groupId={groupId} />;
}
