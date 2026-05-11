import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Database } from "../../../lib/database.types";
import { AdminFormDialog } from "../../components/admin/AdminFormDialog";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";

type Fixture = Database["public"]["Tables"]["fixtures"]["Row"];
type FixtureInsert = Database["public"]["Tables"]["fixtures"]["Insert"];

const empty: FixtureInsert = {
  opponent: "",
  match_date: "",
  kick_off_time: "15:00",
  venue: "Eirias Stadium, Colwyn Bay",
  is_home: true,
  competition: "Betfred Championship",
  tickets_available: false,
};

const toFixtureForm = (fixture?: Fixture): FixtureInsert =>
  fixture
    ? {
        opponent: fixture.opponent,
        match_date: fixture.match_date,
        kick_off_time: fixture.kick_off_time,
        venue: fixture.venue,
        is_home: fixture.is_home,
        competition: fixture.competition,
        result: fixture.result,
        home_score: fixture.home_score,
        away_score: fixture.away_score,
        tickets_available: fixture.tickets_available,
      }
    : empty;

export function FixturesAdmin() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FixtureInsert>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Fixture | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFixtures = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("fixtures").select("*").order("match_date");
    setError(error?.message ?? null);
    setFixtures(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchFixtures();
  }, []);

  const handleSave = async () => {
    if (!form.opponent || !form.match_date) {
      toast.error("Opponent and date are required");
      return;
    }

    setSaving(true);
    setError(null);

    const result = editId
      ? await supabase
          .from("fixtures")
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq("id", editId)
      : await supabase.from("fixtures").insert([form]);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      return;
    }

    toast.success(editId ? "Fixture updated" : "Fixture added");
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    void fetchFixtures();
  };

  const handleEdit = (fixture: Fixture) => {
    setForm(toFixtureForm(fixture));
    setEditId(fixture.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const { data: fixtureTickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("id")
      .eq("fixture_id", deleteTarget.id);

    if (ticketsError) {
      setError(ticketsError.message);
      toast.error(ticketsError.message);
      setDeleting(false);
      return;
    }

    const { error } = await supabase.from("fixtures").delete().eq("id", deleteTarget.id);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setDeleting(false);
      return;
    }

    toast.success("Fixture deleted");
    setDeleteTarget(null);
    setDeleting(false);
    void fetchFixtures();
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-600 transition-colors";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Fixtures</h1>
          <p className="text-gray-500 mt-1">Manage the 2026 season schedule</p>
        </div>
        <button
          onClick={() => {
            setForm(toFixtureForm());
            setEditId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Fixture
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      <AdminFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditId(null);
            setForm(toFixtureForm());
          }
        }}
        title={editId ? "Edit Fixture" : "New Fixture"}
        description="Create or update fixture details in a popup instead of the inline panel."
        footer={
          <>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(toFixtureForm());
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
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
            <label className="text-gray-400 text-xs mb-1 block">Opponent *</label>
            <input
              value={form.opponent ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, opponent: e.target.value }))}
              placeholder="Batley Bulldogs"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Match Date *</label>
            <input
              type="date"
              value={form.match_date ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, match_date: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Kick-off Time</label>
            <input
              type="time"
              value={form.kick_off_time ?? "15:00"}
              onChange={(e) => setForm((prev) => ({ ...prev, kick_off_time: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Venue</label>
            <input
              value={form.venue ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Competition</label>
            <input
              value={form.competition ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, competition: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_home ?? true}
                onChange={(e) => setForm((prev) => ({ ...prev, is_home: e.target.checked }))}
                className="accent-red-600"
              />
              <span className="text-gray-300 text-sm">Home Game</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.tickets_available ?? false}
                onChange={(e) => setForm((prev) => ({ ...prev, tickets_available: e.target.checked }))}
                className="accent-green-600"
              />
              <span className="text-gray-300 text-sm">Tickets Live</span>
            </label>
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
        title="Delete Fixture"
        description={
          deleteTarget
            ? `Delete ${deleteTarget.opponent} on ${format(new Date(deleteTarget.match_date), "d MMM yyyy")}? This cannot be undone if no orders are linked.`
            : ""
        }
        confirmLabel="Delete fixture"
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
                {["Date", "Opponent", "Venue", "H/A", "Tickets", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fixtures.map((fixture) => (
                <tr key={fixture.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-gray-300">{format(new Date(fixture.match_date), "d MMM yyyy")}</td>
                  <td className="px-5 py-3 text-white font-semibold">{fixture.opponent}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fixture.venue}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        fixture.is_home ? "bg-green-800 text-green-200" : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {fixture.is_home ? "H" : "A"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        fixture.tickets_available ? "bg-blue-800 text-blue-200" : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {fixture.tickets_available ? "Live" : "Off"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(fixture)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(fixture)}
                        className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {fixtures.length === 0 && <p className="text-center text-gray-600 py-12">No fixtures added yet.</p>}
        </div>
      )}
    </div>
  );
}
