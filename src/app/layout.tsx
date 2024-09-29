import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Leaf It To Me",
  description: "Stop wasting time, verify your tree now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;        
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="google-site-verification" content="CtXn4Cp66n2avOIts0KUrqlJ1CQEaG5pSqOIX0Vr9Z4" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
