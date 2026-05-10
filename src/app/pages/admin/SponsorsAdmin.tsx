import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Award, Check, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import type { Database } from "../../../lib/database.types";
import { AdminFormDialog } from "../../components/admin/AdminFormDialog";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { uploadBlogImage } from "../../../lib/blogStorage";
import { resolveBlogImageUrl } from "../../../lib/blogMedia";
import { useAuth } from "../../../context/AuthContext";

type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];
type SponsorInsert = Database["public"]["Tables"]["sponsors"]["Insert"];
type SponsorshipPackage = Database["public"]["Tables"]["sponsorship_packages"]["Row"];
type SponsorshipPackageInsert = Database["public"]["Tables"]["sponsorship_packages"]["Insert"];

const sponsorEmpty: SponsorInsert = {
  name: "",
  tier: "Official Partners",
  logo_url: "",
  website_url: "",
  is_active: true,
  sort_order: 0,
};

const packageEmpty: SponsorshipPackageInsert = {
  title: "",
  price_label: "",
  billing_period: "per season",
  benefits: [],
  featured: false,
  contact_email: "admin@northwalesrugby.com",
  is_active: true,
  sort_order: 0,
};

const sponsorTiers = ["Principal Partner", "Premium Partners", "Official Partners"];

const toSponsorForm = (sponsor?: Sponsor): SponsorInsert =>
  sponsor
    ? {
        name: sponsor.name,
        tier: sponsor.tier,
        logo_url: sponsor.logo_url,
        website_url: sponsor.website_url,
        is_active: sponsor.is_active,
        sort_order: sponsor.sort_order,
      }
    : sponsorEmpty;

const toPackageForm = (pkg?: SponsorshipPackage): SponsorshipPackageInsert =>
  pkg
    ? {
        title: pkg.title,
        price_label: pkg.price_label,
        billing_period: pkg.billing_period,
        benefits: pkg.benefits,
        featured: pkg.featured,
        contact_email: pkg.contact_email,
        is_active: pkg.is_active,
        sort_order: pkg.sort_order,
      }
    : packageEmpty;

export function SponsorsAdmin() {
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sponsorForm, setSponsorForm] = useState<SponsorInsert>(sponsorEmpty);
  const [packageForm, setPackageForm] = useState<SponsorshipPackageInsert>(packageEmpty);
  const [sponsorEditId, setSponsorEditId] = useState<string | null>(null);
  const [packageEditId, setPackageEditId] = useState<string | null>(null);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [savingSponsor, setSavingSponsor] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [deleteSponsorTarget, setDeleteSponsorTarget] = useState<Sponsor | null>(null);
  const [deletePackageTarget, setDeletePackageTarget] = useState<SponsorshipPackage | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const sponsorLogoInputRef = useRef<HTMLInputElement | null>(null);

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition-colors focus:border-red-600 focus:outline-none";
  const selectTriggerClass =
    "h-[46px] w-full rounded-lg border-white/10 bg-white/5 px-3 text-sm text-white focus:border-red-600 focus:ring-0";

  const fetchAll = async () => {
    setLoading(true);

    const [sponsorsResponse, packagesResponse] = await Promise.all([
      supabase.from("sponsors").select("*").order("tier").order("sort_order"),
      supabase.from("sponsorship_packages").select("*").order("sort_order"),
    ]);

    setError(sponsorsResponse.error?.message ?? packagesResponse.error?.message ?? null);
    setSponsors(sponsorsResponse.data ?? []);
    setPackages(packagesResponse.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const handleSaveSponsor = async () => {
    if (!sponsorForm.name?.trim()) {
      toast.error("Sponsor name is required");
      return;
    }

    setSavingSponsor(true);

    const payload: SponsorInsert = {
      ...sponsorForm,
      name: sponsorForm.name.trim(),
      logo_url: sponsorForm.logo_url?.trim() || null,
      website_url: sponsorForm.website_url?.trim() || null,
      sort_order: Number(sponsorForm.sort_order ?? 0),
    };

    const result = sponsorEditId
      ? await supabase
          .from("sponsors")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", sponsorEditId)
      : await supabase.from("sponsors").insert([payload]);

    setSavingSponsor(false);

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      return;
    }

    toast.success(sponsorEditId ? "Sponsor updated" : "Sponsor created");
    setShowSponsorForm(false);
    setSponsorEditId(null);
    setSponsorForm(sponsorEmpty);
    void fetchAll();
  };

  const handleSavePackage = async () => {
    if (!packageForm.title?.trim() || !packageForm.price_label?.trim()) {
      toast.error("Package title and price label are required");
      return;
    }

    setSavingPackage(true);

    const payload: SponsorshipPackageInsert = {
      ...packageForm,
      title: packageForm.title.trim(),
      price_label: packageForm.price_label.trim(),
      billing_period: packageForm.billing_period?.trim() || "per season",
      contact_email: packageForm.contact_email?.trim() || "admin@northwalesrugby.com",
      benefits: (packageForm.benefits ?? []).filter(Boolean),
      sort_order: Number(packageForm.sort_order ?? 0),
    };

    const result = packageEditId
      ? await supabase
          .from("sponsorship_packages")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", packageEditId)
      : await supabase.from("sponsorship_packages").insert([payload]);

    setSavingPackage(false);

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      return;
    }

    toast.success(packageEditId ? "Package updated" : "Package created");
    setShowPackageForm(false);
    setPackageEditId(null);
    setPackageForm(packageEmpty);
    void fetchAll();
  };

  const handleDeleteSponsor = async () => {
    if (!deleteSponsorTarget) return;

    setDeletingSponsor(true);
    const { error } = await supabase.from("sponsors").delete().eq("id", deleteSponsorTarget.id);
    setDeletingSponsor(false);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }

    toast.success("Sponsor deleted");
    setDeleteSponsorTarget(null);
    void fetchAll();
  };

  const handleDeletePackage = async () => {
    if (!deletePackageTarget) return;

    setDeletingPackage(true);
    const { error } = await supabase
      .from("sponsorship_packages")
      .delete()
      .eq("id", deletePackageTarget.id);
    setDeletingPackage(false);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }

    toast.success("Package deleted");
    setDeletePackageTarget(null);
    void fetchAll();
  };

  const openSponsorLogoPicker = () => {
    sponsorLogoInputRef.current?.click();
  };

  const handleSponsorLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!user?.id) {
      toast.error("You must be signed in to upload a sponsor logo.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setUploadingLogo(true);

    try {
      const publicUrl = await uploadBlogImage(file, user.id);
      setSponsorForm((prev) => ({ ...prev, logo_url: publicUrl }));
      toast.success("Sponsor logo uploaded");
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Logo upload failed";
      toast.error(message);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="p-8">
      <input
        ref={sponsorLogoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSponsorLogoUpload}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Sponsors</h1>
          <p className="mt-1 text-gray-500">Manage public sponsor cards and sponsorship packages</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setPackageForm(toPackageForm());
              setPackageEditId(null);
              setShowPackageForm(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            <Award className="h-4 w-4" /> Add Package
          </button>
          <button
            onClick={() => {
              setSponsorForm(toSponsorForm());
              setSponsorEditId(null);
              setShowSponsorForm(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600"
          >
            <Plus className="h-4 w-4" /> Add Sponsor
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      <AdminFormDialog
        open={showSponsorForm}
        onOpenChange={(open) => {
          setShowSponsorForm(open);
          if (!open) {
            setSponsorEditId(null);
            setSponsorForm(toSponsorForm());
          }
        }}
        title={sponsorEditId ? "Edit Sponsor" : "New Sponsor"}
        description="Control the sponsor cards that appear on the public sponsors and homepage sections."
        footer={
          <>
            <button
              onClick={() => {
                setShowSponsorForm(false);
                setSponsorEditId(null);
                setSponsorForm(toSponsorForm());
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSaveSponsor}
              disabled={savingSponsor}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {savingSponsor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Name *</label>
            <input
              value={sponsorForm.name ?? ""}
              onChange={(e) => setSponsorForm((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              placeholder="Sponsor name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Tier *</label>
            <Select
              value={sponsorForm.tier ?? sponsorTiers[2]}
              onValueChange={(value) => setSponsorForm((prev) => ({ ...prev, tier: value }))}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                {sponsorTiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Logo URL</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={sponsorForm.logo_url ?? ""}
                onChange={(e) => setSponsorForm((prev) => ({ ...prev, logo_url: e.target.value }))}
                className={inputClass}
                placeholder="https://... or upload below"
              />
              <button
                type="button"
                onClick={openSponsorLogoPicker}
                disabled={uploadingLogo}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </button>
            </div>
            {sponsorForm.logo_url && (
              <img
                src={resolveBlogImageUrl(sponsorForm.logo_url) ?? sponsorForm.logo_url}
                alt="Sponsor logo preview"
                className="mt-3 h-24 w-full rounded-xl border border-white/10 object-contain bg-black/30 p-3"
              />
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Website URL</label>
            <input
              value={sponsorForm.website_url ?? ""}
              onChange={(e) => setSponsorForm((prev) => ({ ...prev, website_url: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Sort Order</label>
            <input
              type="number"
              value={sponsorForm.sort_order ?? 0}
              onChange={(e) => setSponsorForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={sponsorForm.is_active ?? true}
                onChange={(e) => setSponsorForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="accent-red-600"
              />
              Active
            </label>
          </div>
        </div>
      </AdminFormDialog>

      <AdminFormDialog
        open={showPackageForm}
        onOpenChange={(open) => {
          setShowPackageForm(open);
          if (!open) {
            setPackageEditId(null);
            setPackageForm(toPackageForm());
          }
        }}
        title={packageEditId ? "Edit Sponsorship Package" : "New Sponsorship Package"}
        description="Control the package cards shown on the public sponsors page."
        footer={
          <>
            <button
              onClick={() => {
                setShowPackageForm(false);
                setPackageEditId(null);
                setPackageForm(toPackageForm());
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              onClick={handleSavePackage}
              disabled={savingPackage}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {savingPackage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Title *</label>
            <input
              value={packageForm.title ?? ""}
              onChange={(e) => setPackageForm((prev) => ({ ...prev, title: e.target.value }))}
              className={inputClass}
              placeholder="Season Partner"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Price Label *</label>
            <input
              value={packageForm.price_label ?? ""}
              onChange={(e) => setPackageForm((prev) => ({ ...prev, price_label: e.target.value }))}
              className={inputClass}
              placeholder="GBP 10,000"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Billing Period</label>
            <input
              value={packageForm.billing_period ?? ""}
              onChange={(e) => setPackageForm((prev) => ({ ...prev, billing_period: e.target.value }))}
              className={inputClass}
              placeholder="per season"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Contact Email</label>
            <input
              value={packageForm.contact_email ?? ""}
              onChange={(e) => setPackageForm((prev) => ({ ...prev, contact_email: e.target.value }))}
              className={inputClass}
              placeholder="admin@northwalesrugby.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Sort Order</label>
            <input
              type="number"
              value={packageForm.sort_order ?? 0}
              onChange={(e) => setPackageForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))}
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={packageForm.featured ?? false}
                onChange={(e) => setPackageForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="accent-red-600"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={packageForm.is_active ?? true}
                onChange={(e) => setPackageForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="accent-green-600"
              />
              Active
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-gray-400">Benefits (one per line)</label>
            <textarea
              value={(packageForm.benefits ?? []).join("\n")}
              onChange={(e) =>
                setPackageForm((prev) => ({
                  ...prev,
                  benefits: e.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              rows={5}
              className={`${inputClass} min-h-32 resize-y`}
              placeholder={"Logo on team kit\nStadium advertising\n25 season tickets"}
            />
          </div>
        </div>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleteSponsorTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteSponsorTarget(null);
        }}
        title="Delete Sponsor"
        description={deleteSponsorTarget ? `Delete ${deleteSponsorTarget.name}?` : ""}
        confirmLabel="Delete sponsor"
        onConfirm={handleDeleteSponsor}
        confirming={deletingSponsor}
      />

      <AdminDeleteDialog
        open={Boolean(deletePackageTarget)}
        onOpenChange={(open) => {
          if (!open) setDeletePackageTarget(null);
        }}
        title="Delete Sponsorship Package"
        description={deletePackageTarget ? `Delete ${deletePackageTarget.title}?` : ""}
        confirmLabel="Delete package"
        onConfirm={handleDeletePackage}
        confirming={deletingPackage}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-black text-white">Sponsor Cards</h2>
              <p className="mt-1 text-sm text-gray-500">These appear on the homepage and sponsors page.</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-left text-gray-500">
                  {["Name", "Tier", "Order", "Status", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-white font-semibold">{sponsor.name}</td>
                    <td className="px-6 py-4 text-gray-300">{sponsor.tier}</td>
                    <td className="px-6 py-4 text-gray-400">{sponsor.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${sponsor.is_active ? "bg-green-800 text-green-200" : "bg-gray-800 text-gray-400"}`}>
                        {sponsor.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSponsorForm(toSponsorForm(sponsor));
                            setSponsorEditId(sponsor.id);
                            setShowSponsorForm(true);
                          }}
                          className="rounded-lg bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteSponsorTarget(sponsor)}
                          className="rounded-lg bg-red-900/20 p-1.5 text-red-400 hover:bg-red-900/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sponsors.length === 0 && <p className="py-12 text-center text-gray-600">No sponsors created yet.</p>}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-black text-white">Sponsorship Packages</h2>
              <p className="mt-1 text-sm text-gray-500">These appear in the package cards on the sponsors page.</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-left text-gray-500">
                  {["Title", "Price", "Order", "Status", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{pkg.title}</div>
                      <div className="text-xs text-gray-500">{pkg.billing_period}</div>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-bold">{pkg.price_label}</td>
                    <td className="px-6 py-4 text-gray-400">{pkg.sort_order}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${pkg.is_active ? "bg-green-800 text-green-200" : "bg-gray-800 text-gray-400"}`}>
                          {pkg.is_active ? "Active" : "Hidden"}
                        </span>
                        {pkg.featured && (
                          <span className="rounded-full bg-red-800 px-2 py-0.5 text-xs font-bold text-red-100">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setPackageForm(toPackageForm(pkg));
                            setPackageEditId(pkg.id);
                            setShowPackageForm(true);
                          }}
                          className="rounded-lg bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletePackageTarget(pkg)}
                          className="rounded-lg bg-red-900/20 p-1.5 text-red-400 hover:bg-red-900/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {packages.length === 0 && <p className="py-12 text-center text-gray-600">No sponsorship packages created yet.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
