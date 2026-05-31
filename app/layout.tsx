import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { MagneticCursor } from "@/components/ui/MagneticCursor";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { SearchPalette } from "@/components/ui/SearchPalette";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://gravity-shop.com"),
  title: {
    default: "Gravity Shop | Cinematic 3D E-commerce",
    template: "%s | Gravity Shop"
  },
  description: "Experience the future of luxury shopping. A billion-dollar tech ecosystem.",
  openGraph: {
    title: "Gravity Shop | Cinematic 3D E-commerce",
    description: "Experience the future of luxury shopping. A billion-dollar tech ecosystem.",
    url: "https://gravity-shop.com",
    siteName: "Gravity Shop",
    images: [
      {
        url: "https://res.cloudinary.com/gravity-shop-mock/image/upload/v1/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gravity Shop 3D Environment",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravity Shop | Cinematic 3D E-commerce",
    description: "Experience the future of luxury shopping. A billion-dollar tech ecosystem.",
    images: ["https://res.cloudinary.com/gravity-shop-mock/image/upload/v1/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-space-900 text-white antialiased selection:bg-neon-purple/30 selection:text-neon-cyan">
        <MagneticCursor />
        <CartDrawer />
        <AuthModal />
        <SearchPalette />
        {children}
      </body>
    </html>
  );
}
