import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizza Room Batumi — Pizza made for the moment",
  description: "Pizza Room Batumi. Explore our 33 cm pizzas, ingredients and prices. Visit us at Batumi Mall or order delivery.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
