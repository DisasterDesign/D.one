import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Done1 | משרד רואי חשבון - דני",
  description: "משרד רואי חשבון Done1 מעניק מעטפת פיננסית מלאה לעסקים ולשכירים. הנהלת חשבונות, ייעוץ מס, החזרי מס ועוד.",
  keywords: "רואה חשבון, הנהלת חשבונות, החזרי מס, ייעוץ מס, Done1, דני",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Done1 | משרד רואי חשבון - דני",
    description: "שקט נפשי לעסק שלך - מעטפת פיננסית מלאה",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
