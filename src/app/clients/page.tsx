import { ClientDirectory } from "@/components/client-directory";

export default function ClientsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Manage your client directory for quick invoicing.</p>
      </div>
      <ClientDirectory />
    </div>
  );
}
