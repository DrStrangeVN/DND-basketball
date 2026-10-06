import HubView from "@/components/HubView";
import { hubMetadata } from "@/lib/article-route";
export const metadata = hubMetadata("skills");
export default function Page() {
  return <HubView hubId="skills" />;
}
