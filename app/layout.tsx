import type { Metadata, Viewport } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SearchModal from "@/components/SearchModal";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bevn",
  display: "swap",
});

const SITE = "https://learn.danangdragons.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Danang Dragons Learn — Trung tâm kiến thức bóng rổ hoàn chỉnh", template: "%s | Danang Dragons Learn" },
  description: "Học kỹ năng, bài tập, chiến thuật, IQ bóng rổ và kiến thức huấn luyện — từ căn bản đến nâng cao. Học. Tập. Hiểu trận đấu.",
  keywords: ["bóng rổ", "kỹ năng bóng rổ", "bài tập bóng rổ", "pick and roll", "IQ bóng rổ", "huấn luyện bóng rổ", "chiến thuật bóng rổ", "basketball"],
  alternates: { canonical: SITE },
  openGraph: {
    type: "website", siteName: "Danang Dragons Learn", url: SITE,
    title: "Danang Dragons Learn — Trung tâm kiến thức bóng rổ hoàn chỉnh",
    description: "Học kỹ năng, bài tập, chiến thuật, IQ bóng rổ và kiến thức huấn luyện — từ căn bản đến nâng cao.",
  },
  twitter: { card: "summary_large_image", title: "Danang Dragons Learn", description: "Học. Tập. Hiểu trận đấu." },
  icons: { icon: [{ url: "/brand/dnd-favicon.png?v=20261012", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.ico", apple: "/brand/dnd-favicon.png?v=20261012" },
  applicationName: "Danang Dragons Learn",
  authors: [{ name: "Danang Dragons", url: "https://danangdragons.com/" }],
  publisher: "Danang Dragons",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#edf0f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dnd:theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${beVietnamPro.variable} min-h-screen`}>
        <LanguageProvider>
          <Navbar />
          <SearchModal />
          <main className="mx-auto w-full max-w-7xl px-3 pt-6 sm:px-5">{children}</main>
          <Footer />
          <MobileBottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
