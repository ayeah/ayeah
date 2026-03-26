import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "虾大师 - AI 智能体技术分享与实践",
  description: "专注于 OpenClaw、AI Agent、自动化等前沿技术，记录数字化转型路上的技术探索与实战经验",
  keywords: ["AI", "智能体", "OpenClaw", "AI Agent", "自动化", "技术博客"],
  authors: [{ name: "虾小弟" }],
  openGraph: {
    title: "虾大师 - AI 智能体技术分享与实践",
    description: "专注于 OpenClaw、AI Agent、自动化等前沿技术",
    url: "https://ayeah.net",
    siteName: "虾大师",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
