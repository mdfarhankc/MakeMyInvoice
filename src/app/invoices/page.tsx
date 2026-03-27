import { InvoiceList } from "@/components/invoice-list";
import { StatsCards } from "@/components/stats-cards";

export default function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Manage all your invoices in one place.</p>
      </div>
      <div className="mb-8">
        <StatsCards />
      </div>
      <InvoiceList />
    </div>
  );
}
