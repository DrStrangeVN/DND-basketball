import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("basketball-iq");
export default function Page() {
  return <HubView hubId="basketball-iq" />;
}
