import type { Metadata } from "next";
import LibraryView from "@/components/LibraryView";

export const metadata: Metadata = {
  title: "My Basketball Library",
  description: "Your saved basketball concepts, drills, workouts and paths — stored on your device.",
  alternates: { canonical: "https://dndbasketball.vercel.app/library" },
};

export default function LibraryPage() {
  return <LibraryView />;
}
