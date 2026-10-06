import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("pick-and-roll");
export default function Page() {
  return <HubView hubId="pick-and-roll" />;
}
