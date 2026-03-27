"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Client, getClients, saveClient, deleteClient } from "@/lib/invoice-store";
import { generateId } from "@/lib/types";

export function ClientDirectory() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setClients(getClients());
    setLoaded(true);
  }, []);

  function openNew() {
    setEditing(null);
    setName("");
    setEmail("");
    setAddress("");
    setDialogOpen(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    setName(client.name);
    setEmail(client.email);
    setAddress(client.address);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!name.trim()) return;
    const client: Client = {
      id: editing?.id ?? generateId(),
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
    };
    saveClient(client);
    setClients(getClients());
    setDialogOpen(false);
    toast.success(editing ? "Client updated" : "Client added", { description: client.name });
  }

  function handleDelete(client: Client) {
    if (!confirm(`Delete ${client.name}?`)) return;
    deleteClient(client.id);
    setClients(getClients());
    toast.success("Client deleted", { description: client.name });
  }

  if (!loaded) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your Clients</h2>
          <p className="text-muted-foreground text-sm">{clients.length} client{clients.length !== 1 && "s"}</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">No clients yet</h2>
          <p className="text-muted-foreground mb-6">Add clients to quickly fill in their details when creating invoices.</p>
          <Button size="lg" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Client
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(client)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(client)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {client.email && <p className="text-muted-foreground text-sm">{client.email}</p>}
                {client.address && <p className="text-muted-foreground mt-1 whitespace-pre-line text-sm">{client.address}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Name / Business</Label>
              <Input id="clientName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea id="clientAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, Country" rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!name.trim()}>
                {editing ? "Update" : "Add Client"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
