import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YieldSense AI",
  description: "Milestone 1 dashboard shell for agricultural productivity forecasting"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
