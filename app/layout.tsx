import type { Metadata } from "next";
import type { ReactNode } from "react";

import { displayFont } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Vehicle Vision",
  description: "Vehicle image analysis, presented with clarity.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={displayFont.variable}>
        {children}
      </body>
    </html>
  );
}
