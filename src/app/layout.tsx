import type { Metadata } from "next";
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import "sonner/dist/styles.css";
import { cn } from "@/lib/utils";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Prince Verma — Portfolio",
  description: "B.Tech AI & Data Analytics — Developer, Designer, Builder. Crafting cutting-edge digital experiences.",
  keywords: ["Software Engineer", "Web Developer", "React", "Next.js", "AI", "Data Analytics", "Portfolio", "UI/UX", "Frontend", "Full Stack"],
  authors: [{ name: "Prince Verma" }],
  creator: "Prince Verma",
  openGraph: {
    title: "Prince Verma — Developer, Designer, Builder",
    description: "B.Tech AI & Data Analytics. Explore my portfolio of digital experiences and web engineering.",
    url: "https://princeverma.vercel.app", // Adjust if actual domain is different
    siteName: "Prince Verma Portfolio",
    images: [
      {
        url: "/og-image.jpg", // Create this file in public folder later if not exists
        width: 1200,
        height: 630,
        alt: "Prince Verma Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Verma — Developer, Designer, Builder",
    description: "B.Tech AI & Data Analytics. Explore my portfolio of digital experiences and web engineering.",
    creator: "@princeverma", // Adjust to real twitter handle if needed
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, spaceGrotesk.variable)} suppressHydrationWarning>
      <body
        className="bg-black text-white antialiased"
        style={{ fontFamily: "var(--font-space), sans-serif" }}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
