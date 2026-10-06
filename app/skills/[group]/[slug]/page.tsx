import { createSkillRoute } from "@/lib/article-route";
const route = createSkillRoute();
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
