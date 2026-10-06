import { createArticleRoute } from "@/lib/article-route";
const route = createArticleRoute("coaching");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
