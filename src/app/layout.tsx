import type { Metadata } from "next";
import "./globals.css";

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
  twitter: {
    card: "summary",
    title: "虾大师 - AI 智能体技术分享与实践",
    description: "专注于 OpenClaw、AI Agent、自动化等前沿技术",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
