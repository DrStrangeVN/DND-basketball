import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("transition");
export default function Page() {
  return <HubView hubId="transition" />;
}
