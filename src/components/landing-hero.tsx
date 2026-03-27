"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  FileText,
  Zap,
  Printer,
  Shield,
  Users,
  Search,
  Keyboard,
  BookmarkCheck,
  Settings,
  Moon,
  FileDown,
  Copy,
  Clock,
} from "lucide-react";

function FloatingInvoice({ className, delay }: { className?: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-xl border border-zinc-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="h-2 w-16 rounded-full bg-zinc-300 dark:bg-white/20" />
        <div className="h-2 w-8 rounded-full bg-blue-400/40" />
      </div>
      <div className="space-y-2">
        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-white/10" />
        <div className="h-1.5 w-3/4 rounded-full bg-zinc-200 dark:bg-white/10" />
        <div className="h-1.5 w-1/2 rounded-full bg-zinc-200 dark:bg-white/10" />
      </div>
      <div className="mt-3 flex justify-end">
        <div className="h-2 w-12 rounded-full bg-emerald-400/30" />
      </div>
    </motion.div>
  );
}

const heroFeatures = [
  {
    icon: Zap,
    title: "Instant Creation",
    desc: "Build professional invoices in under a minute with our streamlined form.",
  },
  {
    icon: Printer,
    title: "Export as PDF",
    desc: "Download pixel-perfect PDF invoices ready to send to your clients.",
  },
  {
    icon: Shield,
    title: "No Sign-up Required",
    desc: "Start creating immediately. Your data stays in your browser.",
  },
];

const allFeatures = [
  { icon: FileText, title: "Invoice Management", desc: "Create, edit, duplicate, and track invoices with draft, sent, and paid statuses." },
  { icon: Printer, title: "PDF Download", desc: "Export any invoice as a professional A4 PDF with one click." },
  { icon: Users, title: "Client Directory", desc: "Save client details and auto-fill them when creating new invoices." },
  { icon: Search, title: "Search & Filter", desc: "Find invoices instantly by number, client name, or email. Filter by status." },
  { icon: BookmarkCheck, title: "Templates", desc: "Save invoices as reusable templates for recurring clients and projects." },
  { icon: Clock, title: "Auto-save Drafts", desc: "Never lose work — your in-progress invoice is saved automatically." },
  { icon: Copy, title: "Duplicate Invoices", desc: "Clone any invoice with one click. New number, fresh dates, draft status." },
  { icon: FileDown, title: "CSV Export", desc: "Select specific invoices or export all to CSV for bookkeeping." },
  { icon: Settings, title: "Custom Numbering", desc: "Configure your invoice prefix, YYMM date format, and sequential numbering." },
  { icon: Moon, title: "Dark & Light Theme", desc: "Switch between dark and light mode. Follows your system preference." },
  { icon: Keyboard, title: "Keyboard Shortcuts", desc: "Press N for new invoice, / to search, D for dashboard, T for theme." },
  { icon: Shield, title: "100% Private", desc: "All data stored in your browser. Nothing sent to any server." },
];

export function LandingHero() {
  return (
    <div className="relative overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/15 blur-[120px] dark:bg-blue-600/20" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-400/10 blur-[100px] dark:bg-violet-600/15" />
        <div className="absolute bottom-1/3 left-0 h-[300px] w-[400px] -translate-x-1/3 rounded-full bg-cyan-400/10 blur-[80px] dark:bg-cyan-600/10" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 hidden opacity-[0.03] dark:block"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating invoice cards */}
      <FloatingInvoice className="left-[8%] top-[20%] hidden w-44 rotate-[-8deg] lg:block" delay={0.6} />
      <FloatingInvoice className="right-[6%] top-[30%] hidden w-48 rotate-[6deg] lg:block" delay={0.9} />
      <FloatingInvoice className="bottom-[20%] left-[12%] hidden w-40 rotate-[4deg] lg:block" delay={1.2} />

      {/* ===== HERO SECTION ===== */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-24 pt-24 text-center md:pt-32 lg:pt-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-sm text-zinc-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none">
            <FileText className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Free & open-source invoicing
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mt-8 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Create beautiful invoices{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
            in seconds
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl dark:text-zinc-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Professional invoices without the hassle. No account needed — just fill, download as PDF, and send.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <Link
            href="/invoices/new"
            className="group flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:shadow-zinc-900/30 dark:bg-white dark:text-zinc-950 dark:shadow-white/10 dark:hover:shadow-white/20"
          >
            Create Your First Invoice
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/invoices"
            className="flex h-12 items-center rounded-full border border-zinc-300 px-8 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:text-zinc-900 dark:border-white/15 dark:text-zinc-300 dark:hover:border-white/30 dark:hover:text-white"
          >
            View Dashboard
          </Link>
        </motion.div>

        {/* Top 3 features */}
        <motion.div
          className="mt-24 grid w-full gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {heroFeatures.map((feat) => (
            <motion.div
              key={feat.title}
              className="group rounded-2xl border border-zinc-200 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-colors hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.06]"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                <feat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-1 font-semibold">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Invoice mockup */}
        <motion.div
          className="mt-20 w-full max-w-2xl"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-1 shadow-2xl shadow-zinc-300/30 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-blue-500/5">
            <div className="rounded-xl bg-zinc-50 p-6 md:p-8 dark:bg-zinc-900/80">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">INVOICE</div>
                  <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">INV-2603-0001</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  PAID
                </div>
              </div>
              <div className="my-5 h-px bg-zinc-200 dark:bg-white/10" />
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">From</div>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">Acme Studio</div>
                  <div className="text-zinc-400 dark:text-zinc-600">hello@acme.studio</div>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">Bill To</div>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">Widget Corp</div>
                  <div className="text-zinc-400 dark:text-zinc-600">billing@widget.co</div>
                </div>
              </div>
              <div className="my-5 h-px bg-zinc-200 dark:bg-white/10" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400 dark:text-zinc-500">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Brand Identity Design</span>
                  <span className="tabular-nums">$3,200.00</span>
                </div>
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Website Development</span>
                  <span className="tabular-nums">$5,800.00</span>
                </div>
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>SEO Optimization</span>
                  <span className="tabular-nums">$1,500.00</span>
                </div>
              </div>
              <div className="my-4 h-px bg-zinc-200 dark:bg-white/10" />
              <div className="flex justify-end text-sm font-bold text-zinc-900 dark:text-white">
                <span className="mr-6 text-zinc-400 dark:text-zinc-500">Total</span>
                <span className="tabular-nums">$10,500.00</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== ALL FEATURES SECTION ===== */}
      <div className="relative border-t border-zinc-200/60 dark:border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-4 py-24">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to invoice</h2>
            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">Packed with features to make invoicing effortless.</p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {allFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="rounded-xl border border-zinc-200/80 bg-white/50 p-5 backdrop-blur-sm transition-colors hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.06]">
                  <feat.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{feat.title}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-500">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== BOTTOM CTA ===== */}
      <div className="relative border-t border-zinc-200/60 dark:border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to create your first invoice?</h2>
            <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">No sign-up, no credit card. Just start invoicing.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/invoices/new"
                className="group flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 dark:bg-white dark:text-zinc-950 dark:shadow-white/10"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
              Press <kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">?</kbd> anytime for keyboard shortcuts
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
