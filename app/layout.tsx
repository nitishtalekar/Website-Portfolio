import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nitish Talekar – Software engineer",
  description:
    "Lead Software Engineer at Jabali AI building AI-generated games. Work, projects, research and writing by Nitish Talekar.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Nitish Talekar",
    description: "Software engineer. Builds AI-generated games, reads, plays, drinks coffee.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
