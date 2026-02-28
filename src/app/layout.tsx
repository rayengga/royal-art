import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "./layout-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Royal Artisanat - Sacs Artisanaux Tunisiens",
    template: "%s | Royal Artisanat",
  },
  description: "Découvrez notre collection unique de sacs artisanaux pour femmes faits à la main en Tunisie. Artisanat authentique et élégance intemporelle.",
  keywords: ["sacs artisanaux", "artisanat tunisien", "sacs femmes", "couffins", "pochettes", "sacs faits main", "Royal Artisanat", "sacs tunisie", "artisanat"],
  authors: [{ name: "Royal Artisanat", url: "https://royal-artisanat.store" }],
  creator: "Royal Artisanat",
  publisher: "Royal Artisanat",
  metadataBase: new URL("https://royal-artisanat.store"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-TN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: "https://royal-artisanat.store",
    siteName: "Royal Artisanat",
    title: "Royal Artisanat - Sacs Artisanaux Tunisiens",
    description: "Découvrez notre collection unique de sacs artisanaux pour femmes faits à la main en Tunisie. Artisanat authentique et élégance intemporelle.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Royal Artisanat - Sacs Artisanaux Tunisiens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Artisanat - Sacs Artisanaux Tunisiens",
    description: "Découvrez notre collection unique de sacs artisanaux pour femmes faits à la main en Tunisie.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  category: "ecommerce",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preconnect to the external image CDN used by the hero and product images */}
        <link rel="preconnect" href="https://royal-artisanat.store" />
        <link rel="dns-prefetch" href="https://royal-artisanat.store" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
