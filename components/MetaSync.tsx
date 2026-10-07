"use client";
import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Client-side meta sync for the static export.
 * The pre-rendered HTML always carries Vietnamese metadata; when the user
 * switches to English this keeps document.title and the description-flavoured
 * meta tags in the active language.
 */
export default function MetaSync({ title, description }: { title: string; description?: string }) {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = title;
    if (description) {
      const setContent = (selector: string, value: string) => {
        const el = document.head.querySelector(selector) as HTMLMetaElement | null;
        if (el) el.setAttribute("content", value);
      };
      setContent('meta[name="description"]', description);
      setContent('meta[property="og:description"]', description);
      setContent('meta[name="twitter:description"]', description);
    }
    const setTitleMeta = (selector: string) => {
      const el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (el) el.setAttribute("content", title);
    };
    setTitleMeta('meta[property="og:title"]');
    setTitleMeta('meta[name="twitter:title"]');
  }, [lang, title, description]);

  return null;
}
