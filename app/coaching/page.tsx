import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("coaching");
export default function Page() {
  return <HubView hubId="coaching" />;
}
