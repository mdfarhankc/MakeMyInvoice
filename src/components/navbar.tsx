"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Moon, Sun, Plus, LayoutDashboard, Menu, Settings, Users, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency-context";
import { currencies } from "@/lib/currency";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const mainLinks = [
    { href: "/invoices", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
  ];

  const allLinks = [
    ...mainLinks,
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/invoices/new", label: "New Invoice", icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl transition-colors duration-300 print:hidden">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-base font-bold tracking-tight">MakeMyInvoice</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-1.5">
          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex h-8 items-center gap-1 rounded-md border border-border/60 px-2 text-[11px] font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            >
              <span className="text-xs">{currency.symbol}</span>
              <span>{currency.code}</span>
              <ChevronDown className={cn("h-2.5 w-2.5 transition-transform", currencyOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {currencyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-1.5 max-h-60 w-48 overflow-auto rounded-lg border border-border bg-popover p-0.5 shadow-lg"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors hover:bg-accent",
                          c.code === currency.code && "bg-accent font-medium",
                        )}
                      >
                        <span className="w-5 text-center text-sm">{c.symbol}</span>
                        <span className="flex-1 text-left">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.code}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Settings (icon only) */}
          <Link
            href="/settings"
            className={cn(
              "hidden h-8 w-8 items-center justify-center rounded-md transition-colors md:flex",
              pathname === "/settings"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* New Invoice CTA */}
          <Button asChild size="sm" className="hidden h-8 rounded-md px-3 text-[13px] md:flex">
            <Link href="/invoices/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Invoice
            </Link>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 md:hidden"
          >
            <nav className="flex flex-col gap-0.5 p-2">
              {allLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
