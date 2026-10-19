
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import API_ENDPOINTS from "../../config/api";

type SectionKey = "notice" | "description";

type Section = {
  id: number;
  section_key: string;
  label: string;
  title: string;
  content: string;
  icon: string;
  sort_order?: number;
  is_active?: number | boolean | string;
};

type FormState = {
  section_key: SectionKey;
  label: string;
  title: string;
  content: string;
  icon: string;
};

const EMPTY_FORM: FormState = {
  section_key: "description",
  label: "",
  title: "",
  content: "",
  icon: "AlertTriangle",
};

const ENDPOINT = API_ENDPOINTS.ADMIN.DISCLAIMER;

const ICON_OPTIONS = [
  "AlertTriangle",
  "FileText",
  "Wallet",
  "ShieldCheck",
  "Scale",
  "Globe",
  "Clock3",
  "LockKeyhole",
  "Layers3",
];

function getToken() {
  return localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    "";
}

export default function DisclaimerCMS() {
  const [items, setItems] = useState<Section[]>([]);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const request = useCallback(async (url: string, init: RequestInit = {}) => {
    const token = getToken();
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Request failed (${response.status})`);
    }

    return result;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request(ENDPOINT);
      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sections");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [
        item.section_key,
        item.label,
        item.title,
        item.content,
        item.icon,
      ].join(" ").toLowerCase().includes(query)
    );
  }, [items, search]);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormOpen(false);
    setError("");
  };

  const startCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setMessage("");
    setError("");
    setFormOpen(true);
  };

  const startEdit = (item: Section) => {
    setForm({
      section_key: item.section_key === "notice" ? "notice" : "description",
      label: item.label || "",
      title: item.title || "",
      content: item.content || "",
      icon: item.icon || "FileText",
    });

    setEditingId(item.id);
    setMessage("");
    setError("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const oldItem = items.find((item) => item.id === editingId);

      const payload = {
        section_key: form.section_key,
        label: form.label.trim(),
        title: form.title.trim(),
        content: form.content.trim(),
        icon: form.icon,
        sort_order: oldItem?.sort_order ?? 0,
        is_active: oldItem?.is_active ?? 1,
      };

      await request(
        editingId === null ? ENDPOINT : `${ENDPOINT}/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          body: JSON.stringify(payload),
        }
      );

      setMessage(
        editingId === null
          ? "Disclaimer section created successfully."
          : "Disclaimer section updated successfully."
      );

      setForm({ ...EMPTY_FORM });
      setEditingId(null);
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save section");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (item: Section) => {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;

    setError("");
    setMessage("");

    try {
      await request(`${ENDPOINT}/${item.id}`, { method: "DELETE" });
      setMessage("Disclaimer section deleted successfully.");

      if (editingId === item.id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete section");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-4 py-6 text-slate-800 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FileText size={23} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Disclaimer Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage public disclaimer notices and descriptions.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void load()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-[#192e50] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243e67]"
              >
                <Plus size={17} />
                Add Section
              </button>
            </div>
          </div>
        </header>

        {(message || error) && (
          <div
            role="status"
            className={`rounded-lg border p-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {formOpen && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingId === null ? "Add Disclaimer Section" : "Edit Disclaimer Section"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose a section type and enter its content.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                aria-label="Close form"
                className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Section Type
                  <select
                    required
                    value={form.section_key}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        section_key: e.target.value as SectionKey,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="notice">Notice — highlighted warning</option>
                    <option value="description">Description — normal content</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Notice Label (optional)
                  <input
                    maxLength={150}
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="IMPORTANT RISK NOTICE"
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Heading
                  <input
                    required
                    maxLength={255}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter section heading"
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Icon
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className={inputClass}
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Description / Content
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Enter disclaimer content..."
                  className={`${inputClass} resize-y leading-6`}
                />
              </label>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#192e50] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243e67] disabled:opacity-50"
                >
                  {saving ? (
                    <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                  ) : editingId === null ? (
                    <><Plus size={16} /> Create Section</>
                  ) : (
                    <><Pencil size={16} /> Update Section</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-5">
            <div>
              <h2 className="font-bold text-slate-900">Disclaimer Sections</h2>
              <p className="mt-1 text-xs text-slate-500">
                {items.length} total sections
              </p>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sections..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center gap-2 p-12 text-sm text-slate-500">
              <RefreshCw size={17} className="animate-spin" /> Loading sections...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={28} className="mx-auto text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-800">
                {search ? "No matching sections" : "No disclaimer sections yet"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {search ? "Try another search." : "Use Add Section to create your first section."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">#</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Section</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Content</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Type</th>
                    <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                      <td className="px-5 py-4 text-sm text-slate-400">{index + 1}</td>
                      <td className="px-4 py-4">
                        {item.label && (
                          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-600">
                            {item.label}
                          </p>
                        )}
                        <p className="max-w-xs text-sm font-bold text-slate-900">{item.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-lg whitespace-pre-line text-sm leading-5 text-slate-500">
                          {item.content.length > 140
                            ? `${item.content.slice(0, 140)}...`
                            : item.content}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.section_key === "notice"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {item.section_key === "notice" ? "Notice" : "Description"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeItem(item)}
                            aria-label={`Delete ${item.title}`}
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
