import {
  BookOpen, Volleyball, Shield, Zap, GitBranch, Network, Wind, Brain, Users, ClipboardList,
} from "lucide-react";

const MAP: Record<string, typeof BookOpen> = {
  "book-open": BookOpen, dribbble: Volleyball, shield: Shield, zap: Zap,
  "git-branch": GitBranch, network: Network, wind: Wind, brain: Brain,
  users: Users, "clipboard-list": ClipboardList,
};

export default function HubIcon({ icon, className = "h-6 w-6" }: { icon: string; className?: string }) {
  const Icon = MAP[icon] ?? BookOpen;
  return <Icon className={`${className} text-[color:var(--orange)]`} aria-hidden />;
}
