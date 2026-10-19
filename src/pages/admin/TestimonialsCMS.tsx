
import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Video,
  X,
  Wallet,
} from 'lucide-react';

import adminCMSService, {
  type CMSItem,
  type CMSContentType,
  type CMSPayload,
  type CMSStatus,
} from '../../services/adminCMSService';

type TabType = 'testimonial' | 'withdrawal_proof';

interface CMSForm {
  title: string;
  member: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  amount: string;
  reference: string;
}

const emptyForm: CMSForm = {
  title: '',
  member: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  amount: '',
  reference: '',
};

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

const labelClass =
  'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        reject(new Error('Unable to read selected image.'));
        return;
      }

      resolve(result.split(',')[1]);
    };

    reader.onerror = () =>
      reject(new Error('Unable to read selected image.'));

    reader.readAsDataURL(file);
  });

const formatDate = (date?: string) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusClass = (status: CMSStatus) => {
  switch (status) {
    case 'published':
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 ring-red-200';
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-200';
  }
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

const TestimonialsCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('testimonial');
  const [items, setItems] = useState<CMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(
    null
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CMSForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [search, setSearch] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadCMSItems = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await adminCMSService.getAll();
      setItems(Array.isArray(result) ? result : []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCMSItems();
  }, [loadCMSItems]);

  const currentItems = items.filter((item) => item.type === activeTab);

  const filteredItems = currentItems.filter((item) => {
    const text = [
      item.title,
      item.member,
      item.description,
      item.reference,
      item.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  const updateField = (field: keyof CMSForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setFormOpen(false);
  };

  const startCreate = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setFormOpen(true);
  };

  const startEdit = (item: CMSItem) => {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingId(item.id);

    setForm({
      title: item.title || '',
      member: item.member || '',
      description: item.description || '',
      videoUrl: item.video_url || '',
      thumbnailUrl: item.thumbnail_url || '',
      amount:
        item.amount === null || item.amount === undefined
          ? ''
          : String(item.amount),
      reference: item.reference || '',
    });

    setImageFile(null);
    setImagePreview(
      item.image_url
        ? adminCMSService.assetUrl(item.image_url)
        : ''
    );
    setFormOpen(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Choose a JPG, PNG or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must not exceed 5MB.');
      event.target.value = '';
      return;
    }

    setErrorMessage('');
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview((previous) => {
      if (previous.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return previewUrl;
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const title = form.title.trim();

    if (!title) {
      setErrorMessage('Please enter a title.');
      return;
    }

    if (activeTab === 'testimonial') {
      if (!form.videoUrl.trim()) {
        setErrorMessage('Please enter the testimonial video URL.');
        return;
      }

      try {
        const url = new URL(form.videoUrl.trim());

        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        setErrorMessage('Please enter a valid HTTP or HTTPS video URL.');
        return;
      }
    }

    if (
      activeTab === 'withdrawal_proof' &&
      !editingId &&
      !imageFile
    ) {
      setErrorMessage('Please select a withdrawal proof image.');
      return;
    }

    try {
      setSaving(true);

      const payload: Omit<CMSPayload, 'action' | 'id'> = {
        type: activeTab as CMSContentType,
        title,
      };

      if (activeTab === 'testimonial') {
        payload.member = form.member.trim();
        payload.description = form.description.trim();
        payload.videoUrl = form.videoUrl.trim();
        payload.thumbnailUrl = form.thumbnailUrl.trim() || null;
      } else {
        payload.amount = form.amount.trim() || null;
        payload.reference = form.reference.trim() || null;

        if (imageFile) {
          payload.image = await fileToBase64(imageFile);
          payload.imageMimeType = imageFile.type;
        }
      }

      if (editingId !== null) {
        await adminCMSService.update(editingId, payload);
      } else {
        await adminCMSService.create(payload);
      }

      resetForm();
      setSuccessMessage(
        editingId !== null
          ? 'Content updated successfully.'
          : 'Content created successfully.'
      );

      await loadCMSItems();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CMSItem) => {
    const confirmed = window.confirm(
      `Delete "${item.title}" permanently? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await adminCMSService.delete(item.id);

      if (editingId === item.id) resetForm();

      setSuccessMessage('Content deleted successfully.');
      await loadCMSItems();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (
    item: CMSItem,
    status: CMSStatus
  ) => {
    setStatusUpdatingId(item.id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await adminCMSService.updateStatus(item.id, status);
      setSuccessMessage('Content status updated.');
      await loadCMSItems();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const isTestimonial = activeTab === 'testimonial';

  return (
    <div className="w-full space-y-5 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Testimonials & Withdrawal Proofs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the content displayed on your public website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCMSItems}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Content
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {items.length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ImageIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Testimonials
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {items.filter((item) => item.type === 'testimonial').length}
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <Video className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Withdrawal Proofs
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {items.filter(
                  (item) => item.type === 'withdrawal_proof'
                ).length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('testimonial');
              setSearch('');
              resetForm();
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              isTestimonial
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Video className="h-4 w-4" />
            Testimonials
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('withdrawal_proof');
              setSearch('');
              resetForm();
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              !isTestimonial
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wallet className="h-4 w-4" />
            Withdrawal Proofs
          </button>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add {isTestimonial ? 'Testimonial' : 'Withdrawal Proof'}
        </button>
      </div>

      {/* Create / Edit form */}
      {formOpen && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-800">
                {editingId ? 'Edit' : 'Add'}{' '}
                {isTestimonial ? 'Testimonial' : 'Withdrawal Proof'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Complete the fields below and save your changes.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    updateField('title', event.target.value)
                  }
                  placeholder={
                    isTestimonial
                      ? 'Enter testimonial title'
                      : 'Enter withdrawal proof title'
                  }
                  className={inputClass}
                />
              </div>

              {isTestimonial ? (
                <>
                  <div>
                    <label className={labelClass}>Member Name</label>
                    <input
                      value={form.member}
                      onChange={(event) =>
                        updateField('member', event.target.value)
                      }
                      placeholder="Enter member name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Video URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="url"
                      value={form.videoUrl}
                      onChange={(event) =>
                        updateField('videoUrl', event.target.value)
                      }
                      placeholder="https://youtube.com/..."
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Paste a video URL. The video file itself is not uploaded.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(event) =>
                        updateField('description', event.target.value)
                      }
                      placeholder="Write the testimonial description..."
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Thumbnail URL (optional)
                    </label>
                    <input
                      type="url"
                      value={form.thumbnailUrl}
                      onChange={(event) =>
                        updateField('thumbnailUrl', event.target.value)
                      }
                      placeholder="https://example.com/thumbnail.jpg"
                      className={inputClass}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) =>
                        updateField('amount', event.target.value)
                      }
                      placeholder="e.g. 5000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Reference</label>
                    <input
                      value={form.reference}
                      onChange={(event) =>
                        updateField('reference', event.target.value)
                      }
                      placeholder="Transaction reference"
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Withdrawal Proof Image{' '}
                      {!editingId && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                      <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white sm:w-44">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Withdrawal proof preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <ImageIcon className="h-8 w-8" />
                            <span className="text-xs">Image preview</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                          <Upload className="h-4 w-4" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>

                        <p className="mt-2 text-xs text-slate-500">
                          JPG, PNG or WebP. Maximum size 5MB.
                        </p>

                        {imageFile && (
                          <p className="mt-2 break-all text-xs font-medium text-emerald-700">
                            Selected: {imageFile.name}
                          </p>
                        )}

                        {editingId && !imageFile && imagePreview && (
                          <p className="mt-2 text-xs text-slate-500">
                            Existing image will be kept unless you choose a new one.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {editingId ? 'Update Content' : 'Save Content'}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-800">
              {isTestimonial ? 'Testimonials List' : 'Withdrawal Proofs List'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredItems.length} record(s) found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search records..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm">Loading CMS content...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
              {isTestimonial ? (
                <Video className="h-7 w-7" />
              ) : (
                <Wallet className="h-7 w-7" />
              )}
            </div>
            <h3 className="font-semibold text-slate-700">
              No {isTestimonial ? 'testimonials' : 'withdrawal proofs'} found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add your first record using the button above.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">Content</th>
                  {isTestimonial ? (
                    <>
                      <th className="px-5 py-4 font-bold">Member</th>
                      <th className="px-5 py-4 font-bold">Video</th>
                    </>
                  ) : (
                    <>
                      <th className="px-5 py-4 font-bold">Amount</th>
                      <th className="px-5 py-4 font-bold">Proof</th>
                    </>
                  )}
                  <th className="px-5 py-4 font-bold">Date</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="max-w-xs px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}
                      {item.reference && (
                        <p className="mt-1 break-all text-xs text-slate-400">
                          Ref: {item.reference}
                        </p>
                      )}
                    </td>

                    {isTestimonial ? (
                      <>
                        <td className="px-5 py-4 text-slate-600">
                          {item.member || '—'}
                        </td>
                        <td className="px-5 py-4">
                          {item.video_url ? (
                            <a
                              href={item.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Open video
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-4 font-semibold text-slate-700">
                          {item.amount !== null && item.amount !== undefined
                            ? Number(item.amount).toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                              })
                            : '—'}
                        </td>
                        <td className="px-5 py-4">
                          {item.image_url ? (
                            <a
                              href={adminCMSService.assetUrl(item.image_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
                            >
                              <img
                                src={adminCMSService.assetUrl(item.image_url)}
                                alt=""
                                className="h-10 w-12 rounded-md border border-slate-200 object-cover"
                              />
                              <span className="text-xs font-semibold">
                                View proof
                              </span>
                            </a>
                          ) : (
                            'No image'
                          )}
                        </td>
                      </>
                    )}

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(item.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${statusClass(item.status)}`}
                        >
                          {item.status}
                        </span>

                        <select
                          aria-label={`Change status for ${item.title}`}
                          value={item.status}
                          disabled={statusUpdatingId === item.id}
                          onChange={(event) =>
                            handleStatusChange(
                              item,
                              event.target.value as CMSStatus
                            )
                          }
                          className="max-w-36 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-emerald-500 disabled:opacity-50"
                        >
                          {(
                            isTestimonial
                              ? ['draft', 'published']
                              : ['pending', 'approved', 'rejected']
                          ).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          title="Edit"
                          aria-label={`Edit ${item.title}`}
                          className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          title="Delete"
                          aria-label={`Delete ${item.title}`}
                          className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
  );
};

export default TestimonialsCMS;
