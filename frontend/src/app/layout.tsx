import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/Providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "Poster Board",
  description: "Mobile-first infinite feed of event posters"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}