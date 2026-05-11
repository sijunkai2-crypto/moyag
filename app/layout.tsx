import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moyag AI SEO 服务 | Google SEO 优化与海外获客",
  description:
    "Moyag AI 为出海企业提供 Google SEO 策略、关键词布局、技术 SEO、英文内容矩阵与官网线索转化优化服务。",
  keywords: [
    "Google SEO",
    "SEO优化",
    "出海营销",
    "海外获客",
    "B2B SEO",
    "英文SEO",
    "技术SEO",
    "内容营销",
    "Moyag AI",
  ],
  alternates: {
    canonical: "https://seo.moyag-ai.com",
  },
  openGraph: {
    title: "Moyag AI SEO 服务",
    description: "为出海企业建设可持续增长的 Google 搜索流量资产。",
    url: "https://seo.moyag-ai.com",
    siteName: "Moyag AI SEO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
