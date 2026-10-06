import type { Article } from "./types";

/** Pure URL builder — safe to import from client components. */
export function articleUrl(a: Pick<Article, "hub" | "subcategory" | "slug">): string {
  return a.hub === "skills" ? `/skills/${a.subcategory}/${a.slug}` : `/${a.hub}/${a.slug}`;
}
