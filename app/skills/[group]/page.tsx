import HubView from "@/components/HubView";
import { HUBS } from "@/lib/hubs";
import type { Metadata } from "next";

const groups = HUBS.find((h) => h.id === "skills")!.groups;

export async function generateStaticParams() {
  return groups.map((g) => ({ group: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }): Promise<Metadata> {
  const { group } = await params;
  const g = groups.find((x) => x.id === group);
  return {
    title: g ? `${g.title} | Basketball Skills` : "Basketball Skills",
    description: g?.description ?? "Basketball skill development.",
  };
}

export default async function Page({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  return <HubView hubId="skills" groupId={group} />;
}
