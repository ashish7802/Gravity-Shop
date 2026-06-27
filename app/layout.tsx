import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { SearchPalette } from "@/components/ui/SearchPalette";
import { LenisProvider } from "@/components/animations/LenisProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://gravity-shop.com"),
  title: {
    default: "Gravity Shop | Premium 3D Showroom",
    template: "%s | Gravity Shop"
  },
  description: "Experience modern engineering and luxury design. Built for high-fidelity product showrooms.",
  openGraph: {
    title: "Gravity Shop | Premium 3D Showroom",
    description: "Experience modern engineering and luxury design. Built for high-fidelity product showrooms.",
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
    title: "Gravity Shop | Premium 3D Showroom",
    description: "Experience modern engineering and luxury design. Built for high-fidelity product showrooms.",
    images: ["https://res.cloudinary.com/gravity-shop-mock/image/upload/v1/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="bg-[#08080a] text-[#e2e8f0] antialiased selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
        <LenisProvider>
          <CartDrawer />
          <AuthModal />
          <SearchPalette />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
