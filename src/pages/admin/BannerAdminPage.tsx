import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Save,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { buildAssetUrl } from '../../config/api';
import {
  adminBannerService,
  type BannerItem,
  type BannerInput,
} from '../../services/adminBannerService';

type ViewMode = 'list' | 'create' | 'edit';

export const BannerAdminPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [flashMsg, setFlashMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Form State (for Create & Edit)
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    status: number;
    image: string; // base64 or empty
    existingImage: string | null;
  }>({
    title: '',
    subtitle: '',
    description: '',
    status: 1,
    image: '',
    existingImage: null,
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal State
  const [bannerToDelete, setBannerToDelete] = useState<BannerItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Load banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await adminBannerService.getBanners();
      setBanners(data);
    } catch (err: any) {
      console.error('[fetchBanners Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Failed to load banner slides.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-dismiss flash message after 5 seconds matching blade script
  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => {
        setFlashMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  // Open Create Form
  const handleOpenCreate = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      status: 1,
      image: '',
      existingImage: null,
    });
    setFormErrors([]);
    setEditingBannerId(null);
    setViewMode('create');
  };

  // Open Edit Form
  const handleOpenEdit = async (banner: BannerItem) => {
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      status: banner.status ?? 1,
      image: '',
      existingImage: banner.image || null,
    });
    setFormErrors([]);
    setEditingBannerId(banner.id);
    setViewMode('edit');
  };

  // Switch back to List
  const handleBackToList = () => {
    setViewMode('list');
    setEditingBannerId(null);
    setFormErrors([]);
  };

  // Handle File Input Change (with FileReader base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setFormErrors(['Image file size exceeds 4MB limit.']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: base64 }));
      setFormErrors([]);
    };
    reader.readAsDataURL(file);
  };

  // Form Submit (Create or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const errors: string[] = [];
    if (!formData.title.trim()) {
      errors.push('The title field is required.');
    }

    if (viewMode === 'create' && !formData.image) {
      errors.push('The image field is required.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      if (viewMode === 'create') {
        const payload: BannerInput = {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          description: formData.description.trim(),
          status: formData.status,
          image: formData.image,
        };
        await adminBannerService.createBanner(payload);
        setFlashMsg({ type: 'success', text: 'Banner slide created successfully.' });
      } else if (viewMode === 'edit' && editingBannerId) {
        const payload: Partial<BannerInput> = {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          description: formData.description.trim(),
          status: formData.status,
        };
        if (formData.image) {
          payload.image = formData.image;
        }
        await adminBannerService.updateBanner(editingBannerId, payload);
        setFlashMsg({ type: 'success', text: 'Banner slide updated successfully.' });
      }

      await fetchBanners();
      setViewMode('list');
      setEditingBannerId(null);
    } catch (err: any) {
      console.error('[Form Submit Error]', err);
      setFormErrors([err?.message || 'Something went wrong while saving banner slide.']);
    } finally {
      setSubmitting(false);
    }
  };

  // Status Toggle
  const handleToggleStatus = async (banner: BannerItem) => {
    try {
      const res = await adminBannerService.toggleBannerStatus(banner.id);
      setFlashMsg({
        type: 'success',
        text: res.message || 'Banner slide status updated successfully.',
      });
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, status: res.banner_status } : b))
      );
    } catch (err: any) {
      console.error('[Toggle Status Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Unable to update status.',
      });
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;
    try {
      setDeleting(true);
      const res = await adminBannerService.deleteBanner(bannerToDelete.id);
      setFlashMsg({
        type: 'success',
        text: res.message || 'Banner slide deleted successfully.',
      });
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setBannerToDelete(null);
    } catch (err: any) {
      console.error('[Delete Banner Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Unable to delete banner slide.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered & Paginated Banners
  const filteredBanners = banners.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q))
    );
  });

  const totalFiltered = filteredBanners.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * perPage;
  const paginatedBanners = filteredBanners.slice(startIndex, startIndex + perPage);

  // Format Date matching d-m-Y H:i
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return '-';
    }
  };

  // ==========================================================================
  // RENDER: CREATE OR EDIT VIEW (Matching create.blade.php & edit.blade.php)
  // ==========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    const pageTitle = isEdit ? 'Edit Banner Slide' : 'Add Banner Slide';
    const boxTitle = isEdit ? 'Edit Slide' : 'Slide Info';

    return (
      <div className="w-full space-y-6">
        {/* Content Header (Exact matching Laravel content-header) */}
        <div className="content-header">
          <div className="flex items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">{pageTitle}</h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/dashboard" className="hover:text-slate-800 flex items-center">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item">
                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="hover:text-slate-800 text-blue-600 hover:underline"
                      >
                        Banner Slider
                      </button>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      {isEdit ? 'Edit Slide' : 'Add Slide'}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <section className="content">
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                {/* Box Header */}
                <div className="box-header with-border px-6 py-4 border-b border-slate-200">
                  <h4 className="box-title text-base font-bold text-slate-800">{boxTitle}</h4>
                </div>

                {/* Validation Errors Alert matching Laravel @if ($errors->any()) */}
                {formErrors.length > 0 && (
                  <div className="alert alert-danger bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                      {formErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmitForm} className="form">
                  <div className="box-body p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Title */}
                      <div className="form-group space-y-1.5">
                        <label className="form-label block text-xs font-semibold text-slate-700">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          className="form-control w-full border border-slate-300 rounded-md px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Enter slide title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, title: e.target.value }))
                          }
                          required
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="form-group space-y-1.5">
                        <label className="form-label block text-xs font-semibold text-slate-700">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          className="form-control w-full border border-slate-300 rounded-md px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Enter slide subtitle (small text above title)"
                          value={formData.subtitle}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                          }
                        />
                      </div>

                      {/* Image Upload with Preview */}
                      <div className="form-group space-y-1.5">
                        <label className="form-label block text-xs font-semibold text-slate-700">
                          Image {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="image"
                          className="form-control w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!isEdit}
                        />
                        <span className="text-muted block text-[11px] text-slate-500">
                          {isEdit
                            ? 'Leave empty to keep the current image. JPG, JPEG, PNG or WEBP. Max 4MB.'
                            : 'JPG, JPEG, PNG or WEBP. Max 4MB.'}
                        </span>

                        {/* Image Preview Box */}
                        <div
                          className="form-group text-center mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center min-h-[140px]"
                          id="imagePreviewWrap"
                        >
                          {formData.image ? (
                            <img
                              id="imagePreview"
                              src={formData.image}
                              alt="Selected Preview"
                              className="max-w-[320px] max-h-[150px] rounded-md object-cover border border-slate-300 shadow-xs"
                            />
                          ) : formData.existingImage ? (
                            <div className="flex flex-col items-center">
                              <img
                                id="imagePreview"
                                src={buildAssetUrl(formData.existingImage)}
                                alt="Current Image"
                                className="max-w-[320px] max-h-[150px] rounded-md object-cover border border-slate-300 shadow-xs"
                              />
                              <span className="text-[11px] text-slate-500 mt-1.5">
                                Current Image: {formData.existingImage}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-slate-400">
                              <ImageIcon className="w-8 h-8 stroke-1 text-slate-400 mb-1" />
                              <span className="text-xs text-slate-400">No image selected</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="form-group space-y-1.5">
                        <label className="form-label block text-xs font-semibold text-slate-700">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status"
                          className="form-control w-full border border-slate-300 rounded-md px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              status: parseInt(e.target.value, 10),
                            }))
                          }
                          required
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        <p className="text-[11px] text-slate-500">
                          Only active slides will be rendered on the user dashboard hero slider.
                        </p>
                      </div>

                      {/* Description */}
                      <div className="col-span-1 sm:col-span-2 form-group space-y-1.5">
                        <label className="form-label block text-xs font-semibold text-slate-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          className="form-control w-full border border-slate-300 rounded-md p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          rows={3}
                          placeholder="Enter slide description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, description: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Box Footer (Matching Laravel box-footer text-end) */}
                  <div className="box-footer text-end px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {submitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToList}
                      disabled={submitting}
                      className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: LIST VIEW (Matching manage/admin/banner/index.blade.php)
  // ==========================================================================
  return (
    <div className="w-full space-y-6">
      {/* Content Header (Exact matching Laravel content-header) */}
      <div className="content-header">
        <div className="flex items-center">
          <div className="me-auto">
            <h4 className="page-title text-xl font-bold text-slate-800">Banner Slider</h4>
            <div className="d-inline-block align-items-center">
              <nav>
                <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <li className="breadcrumb-item">
                    <Link to="/admin/dashboard" className="hover:text-slate-800 flex items-center">
                      <Home className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                  <span>/</span>
                  <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                    Banner Slider
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="content">
        <div className="row">
          <div className="col-12 w-full">
            <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              {/* Box Header (Exact matching Laravel box-header with-border) */}
              <div className="box-header with-border px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="box-title text-base font-bold text-slate-800">Banner Slider</h3>
                  <h6 className="box-subtitle text-xs text-slate-500 mt-1">
                    Slides shown on the dashboard (only <b className="text-slate-700">Active</b> slides are displayed, ordered by position).
                  </h6>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" /> Add Slide
                  </button>
                  <button
                    type="button"
                    onClick={fetchBanners}
                    title="Refresh banner slides"
                    className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Box Body */}
              <div className="box-body p-6">
                {/* Flash Messages (matching session('msg') and session('err')) */}
                {flashMsg && (
                  <div
                    className={`alert alert-dismissible px-4 py-3 rounded text-xs mb-4 flex items-center justify-between border ${
                      flashMsg.type === 'success'
                        ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]'
                        : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {flashMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{flashMsg.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlashMsg(null)}
                      className="text-current opacity-70 hover:opacity-100 font-bold ml-4"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Filter and Table Tools */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>Show</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(parseInt(e.target.value, 10));
                        setCurrentPage(1);
                      }}
                      className="border border-slate-300 rounded px-2 py-1 text-xs bg-white outline-none"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 w-full sm:w-72 text-xs bg-white">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search title, subtitle, or description..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full outline-none bg-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Responsive */}
                <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
                  <table className="table table-bordered table-hover display nowrap w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3 px-3.5 border-r border-slate-200 w-16 text-center">Sr.No.</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 w-28 text-center">Image</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Title</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Description</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 text-center w-24">Status</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 w-36">Created At</th>
                        <th className="py-3 px-3.5 text-center w-[180px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                              <span>Loading banner slides...</span>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedBanners.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            {searchQuery ? 'No banner slides match your search query.' : 'No banner slides found.'}
                          </td>
                        </tr>
                      ) : (
                        paginatedBanners.map((banner, index) => {
                          const serialNo = startIndex + index + 1;
                          return (
                            <tr
                              key={banner.id}
                              className="hover:bg-slate-50 transition border-b border-slate-100"
                            >
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center font-medium text-slate-600">
                                {serialNo}
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                {banner.image ? (
                                  <img
                                    src={buildAssetUrl(banner.image)}
                                    alt="Banner"
                                    style={{
                                      maxWidth: '90px',
                                      maxHeight: '48px',
                                      borderRadius: '4px',
                                      objectFit: 'cover',
                                    }}
                                    className="mx-auto border border-slate-200 shadow-xs"
                                    onError={(e) => {
                                      // Fallback on broken image
                                      (e.target as HTMLImageElement).src =
                                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="48" fill="%23e2e8f0"><rect width="100%" height="100%"/></svg>';
                                    }}
                                  />
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 font-semibold text-slate-800">
                                <div>{banner.title}</div>
                                {banner.subtitle && (
                                  <div className="text-[11px] text-slate-400 font-normal">
                                    {banner.subtitle}
                                  </div>
                                )}
                              </td>
                              <td
                                className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 max-w-[260px] truncate"
                                title={banner.description || '-'}
                                style={{
                                  maxWidth: '260px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {banner.description || '-'}
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(banner)}
                                  title="Click to toggle status"
                                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer hover:opacity-80 ${
                                    banner.status === 1
                                      ? 'bg-[#28a745] text-white hover:bg-[#218838]'
                                      : 'bg-[#dc3545] text-white hover:bg-[#c82333]'
                                  }`}
                                >
                                  {banner.status === 1 ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                                {formatDate(banner.created_at)}
                              </td>
                              <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(banner)}
                                    className="btn btn-xs btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition"
                                  >
                                    <Edit className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setBannerToDelete(banner)}
                                    className="btn btn-xs btn-danger bg-[#dc3545] hover:bg-[#c82333] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Entries Info and Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-xs text-slate-500">
                  <div>
                    {totalFiltered === 0 ? (
                      'Showing 0 to 0 of 0 entries'
                    ) : (
                      <>
                        Showing {startIndex + 1} to{' '}
                        {Math.min(startIndex + perPage, totalFiltered)} of {totalFiltered} entries
                        {banners.length !== totalFiltered && ` (filtered from ${banners.length} total)`}
                      </>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={validCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === validCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded border text-xs font-semibold transition ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={validCurrentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SweetAlert Style Delete Confirmation Modal */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center border-2 border-amber-300 text-2xl font-bold">
              !
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This banner slide <span className="font-semibold text-slate-700">"{bannerToDelete.title}"</span> will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-[#dc3545] hover:bg-[#c82333] text-white px-4 py-2 rounded text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete it!'}
              </button>
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                disabled={deleting}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold shadow-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
