import { Inter } from "next/font/google";

import { Navbar } from "@/components/Navbar";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Who did what",
  title: "GitHub Issue Viewer",
};

type RootLayoutProps = {
  children: ReactNode;
};
//{/* @ts-expect-error Server Component */}
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Navbar />

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
