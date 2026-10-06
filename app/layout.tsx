import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchModal from "@/components/SearchModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE = "https://dndbasketball.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "DND Basketball — The Complete Basketball Knowledge Hub", template: "%s | DND Basketball" },
  description: "Learn skills, drills, tactics, basketball IQ and coaching concepts — from fundamentals to advanced basketball. Learn. Train. Understand the Game.",
  keywords: ["basketball", "basketball skills", "basketball drills", "pick and roll", "basketball IQ", "basketball coaching", "basketball tactics"],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website", siteName: "DND Basketball", url: SITE,
    title: "DND Basketball — The Complete Basketball Knowledge Hub",
    description: "Learn skills, drills, tactics, basketball IQ and coaching concepts — from fundamentals to advanced basketball.",
  },
  twitter: { card: "summary_large_image", title: "DND Basketball", description: "Learn. Train. Understand the Game." },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#edf0f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dnd:theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen`}>
        <Navbar />
        <SearchModal />
        <main className="mx-auto w-full max-w-7xl px-3 pt-6 sm:px-5">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
