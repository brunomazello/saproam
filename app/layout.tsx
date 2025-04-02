import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Oxanium } from "next/font/google";
import Script from "next/script";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "South America Pro-AM League 2025",
  icons: { icon: "/basketball.png" },
};

const oxanium = Oxanium({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const montserrat = Montserrat({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${oxanium.variable} ${montserrat.variable}`}>
      <head>
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8650473573508274"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-black text-gray-100 antialiased bg-[url('/background.png')] bg-no-repeat sm:bg-top bg-center bg-cover">
        <Navbar/>
        <main className="max-w-[1240px] mx-auto px-5 py-8 md:py-0">{children}</main>
      </body>
    </html>
  );
}
