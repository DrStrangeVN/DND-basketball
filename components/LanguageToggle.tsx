"use client";
import { useLanguage } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      className="flex items-center rounded-full p-0.5 text-[11px] font-bold"
      style={{
        background: "var(--neu-inset, #e4e7ec)",
        boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)",
      }}
      role="group"
      aria-label={t("lang.label")}
    >
      {(["vi", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className="rounded-full px-2 py-1 uppercase tracking-wide transition-all"
          style={
            lang === l
              ? { background: "var(--orange)", color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }
              : { color: "var(--muted, #6b7280)" }
          }
        >
          {l}
        </button>
      ))}
    </div>
  );
}
