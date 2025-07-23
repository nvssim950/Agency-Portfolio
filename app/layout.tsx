import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NVS Agency",
  description: "NVS Agency is a professional web development and business automation company specializing in modern digital solutions. We create high-performance websites, scalable SaaS platforms, and efficient dashboards using technologies like Next.js, Tailwind CSS, and React. Our automation services use Python and N8N to eliminate manual tasks and streamline business operations. With a proven track record of delivering user-friendly, SEO-optimized, and responsive web projects, NVS helps clients increase productivity, reduce costs, and stand out in today’s competitive digital landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
