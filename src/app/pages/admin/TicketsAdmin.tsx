import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";
import type { Database } from "../../../lib/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AdminFormDialog } from "../../components/admin/AdminFormDialog";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";

type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
type TicketType = Database["public"]["Enums"]["ticket_type"];

const empty: TicketInsert = {
  type: "adult",
  label: "",
  price_gbp: 1500,
  availability: 100,
  sold_count: 0,
  max_per_order: 6,
  description: "",
  feature_bullets: [],
  fixture_id: null,
};

const toTicketForm = (ticket?: Ticket): TicketInsert =>
  ticket
    ? {
        fixture_id: ticket.fixture_id,
        type: ticket.type,
        label: ticket.label,
        price_gbp: ticket.price_gbp,
        availability: ticket.availability,
        sold_count: ticket.sold_count,
        on_sale_at: ticket.on_sale_at,
        max_per_order: ticket.max_per_order,
        description: ticket.description,
        feature_bullets: ticket.feature_bullets,
      }
    : empty;

export function TicketsAdmin() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fixtures, setFixtures] = useState<{ id: string; opponent: string; match_date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TicketInsert>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [ticketsResponse, fixturesResponse] = await Promise.all([
      supabase.from("tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("fixtures").select("id, opponent, match_date").order("match_date"),
    ]);

    setError(ticketsResponse.error?.message ?? fixturesResponse.error?.message ?? null);
    setTickets(ticketsResponse.data ?? []);
    setFixtures(fixturesResponse.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const handleSave = async () => {
    if (!form.label) {
      toast.error("Label is required");
      return;
    }

    const payload: TicketInsert = {
      ...form,
      fixture_id: form.type === "season_pass" ? null : form.fixture_id ?? null,
      price_gbp: Math.max(0, form.price_gbp ?? 0),
      availability: Math.max(0, form.availability ?? 0),
      max_per_order: Math.max(1, form.max_per_order ?? 1),
    };

    setSaving(true);

    const result = editId
      ? await supabase.from("tickets").update(payload).eq("id", editId)
      : await supabase.from("tickets").insert([payload]);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      return;
    }

    toast.success(editId ? "Ticket updated" : "Ticket created");
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    void fetchAll();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const [{ count: orderItemCount, error: orderItemError }, { count: seasonPassCount, error: seasonPassError }] =
      await Promise.all([
        supabase.from("order_items").select("id", { count: "exact", head: true }).eq("ticket_id", deleteTarget.id),
        supabase.from("season_passes").select("id", { count: "exact", head: true }).eq("ticket_id", deleteTarget.id),
      ]);

    if (orderItemError || seasonPassError) {
      const message = orderItemError?.message ?? seasonPassError?.message ?? "Unable to validate ticket usage.";
      setError(message);
      toast.error(message);
      setDeleting(false);
      return;
    }

    if ((orderItemCount ?? 0) > 0 || (seasonPassCount ?? 0) > 0) {
      const message =
        "This ticket cannot be deleted because it is already linked to orders or season passes. Disable it in the UI by renaming or setting stock to 0 instead.";
      setError(message);
      toast.error(message);
      setDeleting(false);
      return;
    }

    const { error } = await supabase.from("tickets").delete().eq("id", deleteTarget.id);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setDeleting(false);
      return;
    }

    toast.success("Deleted");
    setDeleteTarget(null);
    setDeleting(false);
    void fetchAll();
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-600 transition-colors";
  const selectTriggerClass =
    "h-[46px] w-full rounded-lg border-white/10 bg-white/5 px-3 text-sm text-white focus:border-red-600 focus:ring-0";
  const ticketTypes: TicketType[] = ["adult", "concession", "junior", "season_pass"];

  const getFixtureLabel = (id: string | null) => {
    if (!id) return "Season Pass (all home games)";
    const fixture = fixtures.find((item) => item.id === id);
    return fixture ? fixture.opponent : id;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Tickets</h1>
          <p className="text-gray-500 mt-1">Manage ticket types and pricing</p>
        </div>
        <button
          onClick={() => {
            setForm(toTicketForm());
            setEditId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Add Ticket Type
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      <AdminFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditId(null);
            setForm(toTicketForm());
          }
        }}
        title={editId ? "Edit Ticket" : "New Ticket Type"}
        description="Manage ticket details in a centered popup instead of the inline section."
        footer={
          <>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(toTicketForm());
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
          </>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Fixture</label>
            <Select
              value={form.fixture_id ?? "__season_pass__"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  fixture_id: value === "__season_pass__" ? null : value,
                }))
              }
              disabled={form.type === "season_pass"}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Select fixture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__season_pass__">Season Pass (no specific fixture)</SelectItem>
                {fixtures.map((fixture) => (
                  <SelectItem key={fixture.id} value={fixture.id}>
                    {fixture.opponent} - {fixture.match_date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Type</label>
            <Select
              value={form.type}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  type: value as TicketType,
                  fixture_id: value === "season_pass" ? null : prev.fixture_id,
                }))
              }
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((ticketType) => (
                  <SelectItem key={ticketType} value={ticketType}>
                    {ticketType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Label *</label>
            <input
              value={form.label ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Adult Matchday"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Price (pence) - e.g. 1500 = GBP15</label>
            <input
              type="number"
              min="0"
              value={form.price_gbp ?? 0}
              onChange={(e) => setForm((prev) => ({ ...prev, price_gbp: Number(e.target.value) || 0 }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Availability</label>
            <input
              type="number"
              min="0"
              value={form.availability ?? 100}
              onChange={(e) => setForm((prev) => ({ ...prev, availability: Number(e.target.value) || 0 }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Max per Order</label>
            <input
              type="number"
              min="1"
              value={form.max_per_order ?? 6}
              onChange={(e) => setForm((prev) => ({ ...prev, max_per_order: Number(e.target.value) || 1 }))}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-gray-400 text-xs mb-1 block">Description (optional)</label>
            <input
              value={form.description ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Standard seated access..."
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-gray-400 text-xs mb-1 block">Feature bullets (one per line)</label>
            <textarea
              value={(form.feature_bullets ?? []).join("\n")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  feature_bullets: e.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              rows={4}
              placeholder={"Premium seating\nMeal included\nVIP lounge"}
              className={`${inputClass} min-h-28 resize-y`}
            />
          </div>
        </div>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Delete Ticket Type"
        description={
          deleteTarget
            ? `Delete ${deleteTarget.label}? This is only allowed when the ticket is not linked to orders or season passes.`
            : ""
        }
        confirmLabel="Delete ticket"
        onConfirm={handleDelete}
        confirming={deleting}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-gray-500 text-left">
                {["Fixture", "Label", "Type", "Price", "Stock", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/5">
                  <td className="px-5 py-3 text-gray-400 text-xs max-w-[180px] truncate">{getFixtureLabel(ticket.fixture_id)}</td>
                  <td className="px-5 py-3 text-white font-semibold">{ticket.label}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-gray-800 rounded-full text-gray-400 text-xs">{ticket.type}</span>
                  </td>
                  <td className="px-5 py-3 text-green-400 font-bold">GBP{(ticket.price_gbp / 100).toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {ticket.sold_count}/{ticket.availability}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setForm(toTicketForm(ticket));
                          setEditId(ticket.id);
                          setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(ticket)}
                        className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && <p className="text-center text-gray-600 py-12">No ticket types created yet.</p>}
        </div>
      )}
    </div>
  );
}
