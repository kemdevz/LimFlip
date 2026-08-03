import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { MobileLayoutProvider } from "@/context/MobileLayoutContext";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MM2Stake.com - Leading MM2 Casino with finest gamemodes in the world!",
  description: "MM2Stake.com is a crypto/mm2 casino with various game-modes including coinflip, jackpot and more. We also offer a marketplace service with lowest selling/buying fees! Visit MM2Stake.com!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>
          <MobileLayoutProvider>
            {children}
            <MobileBottomNav />
            <ToastProvider />
          </MobileLayoutProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
