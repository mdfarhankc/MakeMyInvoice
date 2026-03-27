export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  number: string;
  createdAt: string;
  dueDate: string;
  status: "draft" | "sent" | "paid";

  // Sender
  fromName: string;
  fromEmail: string;
  fromAddress: string;

  // Client
  toName: string;
  toEmail: string;
  toAddress: string;

  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  currency?: string;
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateTax(
  items: InvoiceItem[],
  taxRate: number,
): number {
  return calculateSubtotal(items) * (taxRate / 100);
}

export function calculateTotal(
  items: InvoiceItem[],
  taxRate: number,
): number {
  return calculateSubtotal(items) + calculateTax(items, taxRate);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export { getNextInvoiceNumber as generateInvoiceNumber } from "./invoice-store";
