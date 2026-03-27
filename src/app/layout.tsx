import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/lib/currency-context";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MakeMyInvoice — Create Invoices Instantly",
  description: "Create, manage, and print professional invoices. No sign-up required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CurrencyProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <KeyboardShortcuts />
            <Toaster position="bottom-right" richColors closeButton />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
