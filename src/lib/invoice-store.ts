import type { Invoice } from "./types";

const STORAGE_KEY = "invoicer_invoices";

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Invoice[];
  } catch {
    return [];
  }
}

export function getInvoice(id: string): Invoice | undefined {
  return getInvoices().find((inv) => inv.id === id);
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const idx = invoices.findIndex((inv) => inv.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

// --- Sender details (Remember From) ---

const SENDER_KEY = "invoicer_sender";

export interface SenderDetails {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
}

export function getSavedSender(): SenderDetails | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SENDER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SenderDetails;
  } catch {
    return null;
  }
}

export function saveSender(sender: SenderDetails): void {
  localStorage.setItem(SENDER_KEY, JSON.stringify(sender));
}

// --- Templates ---

const TEMPLATES_KEY = "invoicer_templates";

export interface InvoiceTemplate {
  id: string;
  name: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: Invoice["items"];
  taxRate: number;
  notes: string;
  currency?: string;
}

export function getTemplates(): InvoiceTemplate[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TEMPLATES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InvoiceTemplate[];
  } catch {
    return [];
  }
}

export function saveTemplate(template: InvoiceTemplate): void {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.unshift(template);
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

// --- Client Directory ---

const CLIENTS_KEY = "invoicer_clients";

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CLIENTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Client[];
  } catch {
    return [];
  }
}

export function saveClient(client: Client): void {
  const clients = getClients();
  const idx = clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) {
    clients[idx] = client;
  } else {
    clients.unshift(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

// --- Invoice Numbering Settings ---

const NUMBERING_KEY = "invoicer_numbering";

export interface NumberingSettings {
  prefix: string;
  nextNumber: number;
  padding: number;
  includeDate: boolean;
}

const DEFAULT_NUMBERING: NumberingSettings = {
  prefix: "INV",
  nextNumber: 1,
  padding: 4,
  includeDate: true,
};

export function getNumberingSettings(): NumberingSettings {
  if (typeof window === "undefined") return DEFAULT_NUMBERING;
  const raw = localStorage.getItem(NUMBERING_KEY);
  if (!raw) return DEFAULT_NUMBERING;
  try {
    return { ...DEFAULT_NUMBERING, ...(JSON.parse(raw) as Partial<NumberingSettings>) };
  } catch {
    return DEFAULT_NUMBERING;
  }
}

export function saveNumberingSettings(settings: NumberingSettings): void {
  localStorage.setItem(NUMBERING_KEY, JSON.stringify(settings));
}

export function getNextInvoiceNumber(): string {
  const settings = getNumberingSettings();
  const num = settings.nextNumber.toString().padStart(settings.padding, "0");
  let number = settings.prefix;
  if (settings.includeDate) {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    number += `-${yy}${mm}`;
  }
  number += `-${num}`;
  // Increment for next time
  saveNumberingSettings({ ...settings, nextNumber: settings.nextNumber + 1 });
  return number;
}
