import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babel for Spreadsheets",
  description: "Proof of Concept for Babel | To be integrated into Babel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
