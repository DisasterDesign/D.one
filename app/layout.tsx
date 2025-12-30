import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Done1 | ליווי פיננסי לחברות בנייה ויזמות",
  description: "Done1 - ליווי פיננסי מקצועי לחברות יזום ובנייה. ניהול יזום, ביצוע בנייה, הנהלת חשבונות וייעוץ מס.",
  keywords: "ליווי חברות בנייה, ניהול יזום, ביצוע בנייה, הנהלת חשבונות קבלנים, ייעוץ מס נדל\"ן, Done1",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Done1 | ליווי פיננסי לחברות בנייה ויזמות",
    description: "שקט נפשי לפרויקט שלך - ליווי פיננסי מקצועי לחברות יזום ובנייה",
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
