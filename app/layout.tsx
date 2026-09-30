import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const georgian = Noto_Serif_Georgian({
  subsets: ["georgian"],
  weight: ["300", "400", "600"],
  variable: "--font-georgian",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heart of Batumi — Art Café in the Old City",
  description: "Heart of Batumi — art café restaurant in the heart of Batumi's Old City. Georgian cuisine, local wine, live atmosphere. Open daily 10:00–midnight.",
  openGraph: {
    title: "Heart of Batumi — Art Café in the Old City",
    description: "Georgian cuisine, local wine and art atmosphere in Batumi's historic centre.",
    url: "https://heartofbatumi.vercel.app",
    siteName: "Heart of Batumi",
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${montserrat.variable} ${georgian.variable}`}>{children}</body>
    </html>
  );
}
