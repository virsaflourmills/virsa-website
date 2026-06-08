import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virsa Flour Mills | Canada's 1st & Only Cold-Pressed Flour Mill",
  description:
    "Fresh cold-pressed atta milled in Canada. Traditional stone-style freshness, clean ingredients, and authentic taste.",
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
