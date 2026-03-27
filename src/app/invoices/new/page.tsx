import { InvoiceForm } from "@/components/invoice-form";

export default function NewInvoicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Invoice</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Fill in the details below to create an invoice.</p>
      </div>
      <InvoiceForm />
    </div>
  );
}
