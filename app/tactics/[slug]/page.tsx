import { createArticleRoute } from "@/lib/article-route";
const route = createArticleRoute("tactics");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
