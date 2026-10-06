"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("dnd:theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="neu-btn inline-flex h-10 w-10 items-center justify-center text-[color:var(--ink)]">
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
