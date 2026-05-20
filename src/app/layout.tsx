import type { Metadata } from "next";
import { Geist, Geist_Mono, Fira_Code, Antic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["700"],
});

const antic = Antic({
  variable: "--font-antic",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Raj Kumar Gupta | Full-Stack Developer & Security Analyst",
  description:
    "Portfolio of Raj Kumar Gupta — Full-Stack Developer, DevOps Engineer, and Security Analyst. Building secure & scalable applications with Python, TypeScript, React, and cloud technologies.",
  keywords: [
    "Raj Kumar Gupta",
    "Full-Stack Developer",
    "DevOps Engineer",
    "Security Analyst",
    "Python",
    "TypeScript",
    "React",
    "Portfolio",
  ],
  authors: [{ name: "Raj Kumar Gupta", url: "https://github.com/rkg765" }],
  openGraph: {
    title: "Raj Kumar Gupta | Full-Stack Developer & Security Analyst",
    description: "Building secure & scalable applications.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} ${antic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
