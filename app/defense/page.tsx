import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("defense");
export default function Page() {
  return <HubView hubId="defense" />;
}
