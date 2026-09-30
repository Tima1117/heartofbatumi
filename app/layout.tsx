import type { Metadata } from "next";
import "./globals.css";

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
  return <html lang="en"><body>{children}</body></html>;
}
