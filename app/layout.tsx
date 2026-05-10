import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const markPro = DM_Sans({
  variable: "--font-mark-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MicTu",
    template: "%s | MicTu",
  },
  description: "讀書心得、隨筆思考與技術筆記",
  openGraph: {
    title: "MicTu",
    description: "讀書心得、隨筆思考與技術筆記",
    images: ["/MicTu.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MicTu",
    description: "讀書心得、隨筆思考與技術筆記",
    images: ["/MicTu.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${markPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
