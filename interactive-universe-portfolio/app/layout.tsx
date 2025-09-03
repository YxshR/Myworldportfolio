import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { PremiumCursor } from "@/components/ui";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Interactive Universe Portfolio",
  description: "A premium 3D portfolio experience featuring an interactive universe with Earth and stars representing real-time visitors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased cursor-none`}
      >
        <PremiumCursor />
        {children}
      </body>
    </html>
  );
}
