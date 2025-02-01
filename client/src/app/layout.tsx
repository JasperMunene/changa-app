import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Raleway, } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const afacad = Raleway({
  variable: "--afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "Changa",
  description: "CrowdFunding App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    >
      <html lang="en">
        <body className={`${afacad.className}  antialiased`}>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
