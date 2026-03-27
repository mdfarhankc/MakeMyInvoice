# MakeMyInvoice

Free online invoice generator. Create, manage, and export professional invoices as PDF. No sign-up needed — your data stays in your browser.

## Features

- **Invoice Management** — Create, edit, duplicate, and delete invoices with draft/sent/paid status tracking
- **PDF Export** — Download pixel-perfect A4 PDFs with one click
- **Client Directory** — Save client details and auto-fill when creating invoices
- **Dashboard** — Stats cards, search, filter by status, sortable columns, overdue indicators
- **Templates** — Save invoices as reusable templates for recurring work
- **Auto-save Drafts** — Never lose work — drafts are saved automatically as you type
- **CSV Export** — Select specific invoices or export all for bookkeeping
- **Custom Numbering** — Configure prefix, YYMM date format, zero-padding, and sequential numbers
- **15 Currencies** — USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, BRL, KRW, MXN, SGD, AED, NGN
- **Dark & Light Theme** — Toggle between themes or follow system preference
- **Keyboard Shortcuts** — `N` new invoice, `/` search, `D` dashboard, `T` theme, `?` help
- **Undo Delete** — Deleted an invoice by mistake? Hit undo in the toast
- **100% Private** — All data stored in localStorage. Nothing leaves your browser

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, React 19, Turbopack
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — Radix-based component library
- [Motion](https://motion.dev/) — Animations
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark mode
- [Sonner](https://sonner.emilkowal.dev/) — Toast notifications
- [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas-pro](https://github.com/nicolo-ribaudo/html2canvas-pro) — PDF generation

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) to get started.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Create new invoice |
| `D` | Go to dashboard |
| `/` | Focus search |
| `T` | Toggle dark/light theme |
| `?` | Show shortcuts help |

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    layout.tsx            # Root layout with providers
    invoices/
      page.tsx            # Dashboard
      new/page.tsx        # Create invoice
      [id]/page.tsx       # View invoice
      [id]/edit/page.tsx  # Edit invoice
    clients/page.tsx      # Client directory
    settings/page.tsx     # Invoice numbering settings
  components/
    landing-hero.tsx      # Landing page hero + features
    navbar.tsx            # Navigation bar
    invoice-form.tsx      # Create/edit form
    invoice-preview.tsx   # View invoice + actions
    invoice-list.tsx      # Dashboard table
    stats-cards.tsx       # Dashboard stats
    client-directory.tsx  # Client CRUD
    keyboard-shortcuts.tsx
    theme-provider.tsx
    ui/                   # shadcn/ui components
  lib/
    invoice-store.ts      # localStorage CRUD
    types.ts              # TypeScript types + helpers
    currency.ts           # Currency definitions
    currency-context.tsx  # Currency React context
    generate-pdf.ts       # PDF generation
    utils.ts              # cn() utility
```

## License

MIT
