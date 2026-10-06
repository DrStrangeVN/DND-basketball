import { getArticlesByGroup } from "@/lib/content";
import { hubById, type HubMeta, type HubGroup } from "@/lib/hubs";
import { toArticleCard, type ArticleCardData } from "@/lib/types";
import { notFound } from "next/navigation";
import HubViewClient from "./HubViewClient";

export default function HubView({ hubId, groupId }: { hubId: string; groupId?: string }) {
  const hub = hubById(hubId);
  if (!hub) notFound();
  const groups = groupId ? hub.groups.filter((g) => g.id === groupId) : hub.groups;
  if (groupId && groups.length === 0) notFound();

  const groupsData: { group: HubGroup; articles: ArticleCardData[] }[] = groups.map((g) => ({
    group: g,
    articles: getArticlesByGroup(hubId, g.id).map(toArticleCard),
  })).filter((gd) => gd.articles.length > 0);

  return <HubViewClient hub={hub} groupsData={groupsData} groupId={groupId} showGroupTitles={!groupId && hub.groups.length > 1} />;
}

export function GroupArticles({ hubId, groupId }: { hubId: string; groupId: string }) {
  return <HubView hubId={hubId} groupId={groupId} />;
}
