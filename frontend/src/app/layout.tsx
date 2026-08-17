import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { TermsGate } from "@/components/TermsGate";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Alpha Peptides",
    template: "%s | Alpha Peptides",
  },
  description:
    "Exceptional research peptides known for purity and affordability. Third-party tested. For laboratory research use only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`} suppressHydrationWarning>
      <body
        className="flex min-h-full flex-col font-[family-name:var(--font-poppins)] antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <TermsGate />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
