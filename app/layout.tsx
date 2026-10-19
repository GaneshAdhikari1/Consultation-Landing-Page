import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://digital-ganesh-consultation.rajashrim34.chatgpt.site"),
  title: "Free Digital Marketing Consultation | Digital Ganesh",
  description:
    "Book a free 1-hour one-to-one call and get a customized digital marketing plan for your business in PDF format.",
  openGraph: {
    title: "Free Digital Marketing Consultation | Digital Ganesh",
    description:
      "Book a free 1-hour one-to-one call and get a customized digital marketing plan for your business.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Digital Ganesh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Digital Marketing Consultation | Digital Ganesh",
    description:
      "Book a free 1-hour one-to-one call and get a customized digital marketing plan for your business.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
