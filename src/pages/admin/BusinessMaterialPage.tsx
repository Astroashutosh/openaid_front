import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Plus,
  ArrowLeft,
  FileText,
  Save,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';
import { buildAssetUrl } from '../../config/api';
import {
  adminBusinessMaterialService,
  type BusinessMaterialItem,
} from '../../services/adminBusinessMaterialService';

export const BusinessMaterialPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  // Determine current view mode from route or internal state
  const isCreateRoute = location.pathname.includes('/create');
  const isEditRoute = location.pathname.includes('/edit/');
  const routeEditId = params.id ? parseInt(params.id, 10) : null;

  const [materials, setMaterials] = useState<BusinessMaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [flashMsg, setFlashMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State (for both Create and Edit)
  const [activeMode, setActiveMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formStatus, setFormStatus] = useState<number>(1);
  const [formFileBase64, setFormFileBase64] = useState<string | null>(null);
  const [formFileName, setFormFileName] = useState<string>('');
  const [formCoverBase64, setFormCoverBase64] = useState<string | null>(null);
  const [formCoverName, setFormCoverName] = useState<string>('');
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modal States
  const [deleteTarget, setDeleteTarget] = useState<BusinessMaterialItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => setFlashMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  // Fetch materials list
  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminBusinessMaterialService.getMaterials();
      setMaterials(data);
    } catch (err: any) {
      console.error('[fetchMaterials Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to load business materials.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Synchronize route state with view mode
  useEffect(() => {
    if (isCreateRoute) {
      setActiveMode('create');
      resetForm();
    } else if (isEditRoute && routeEditId) {
      setActiveMode('edit');
      setEditingMaterialId(routeEditId);
      loadMaterialForEdit(routeEditId);
    } else {
      setActiveMode('list');
      setEditingMaterialId(null);
    }
  }, [location.pathname, isCreateRoute, isEditRoute, routeEditId]);

  // Load single material into edit form
  const loadMaterialForEdit = async (id: number) => {
    try {
      setLoading(true);
      const item = await adminBusinessMaterialService.getMaterialById(id);
      if (item) {
        setFormTitle(item.title);
        setFormDescription(item.description || '');
        setFormStatus(Number(item.status));
        setCurrentFileUrl(item.file);
        setCurrentCoverUrl(item.cover_image);
        setFormFileBase64(null);
        setFormFileName('');
        setFormCoverBase64(null);
        setFormCoverName('');
      }
    } catch (err: any) {
      console.error('[loadMaterialForEdit Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to load material for editing.' });
      navigate('/admin/business-material');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStatus(1);
    setFormFileBase64(null);
    setFormFileName('');
    setFormCoverBase64(null);
    setFormCoverName('');
    setCurrentFileUrl(null);
    setCurrentCoverUrl(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setActiveMode('create');
    navigate('/admin/business-material/create');
  };

  const handleOpenEdit = (item: BusinessMaterialItem) => {
    setEditingMaterialId(item.id);
    setFormTitle(item.title);
    setFormDescription(item.description || '');
    setFormStatus(Number(item.status));
    setCurrentFileUrl(item.file);
    setCurrentCoverUrl(item.cover_image);
    setFormFileBase64(null);
    setFormFileName('');
    setFormCoverBase64(null);
    setFormCoverName('');
    setActiveMode('edit');
    navigate(`/admin/business-material/edit/${item.id}`);
  };

  const handleBackToList = () => {
    resetForm();
    setActiveMode('list');
    setEditingMaterialId(null);
    navigate('/admin/business-material');
  };

  // File Input Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFlashMsg({ type: 'error', text: 'File exceeds maximum allowed size of 10 MB.' });
      e.target.value = '';
      return;
    }

    setFormFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormFileBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Cover Image Input Handler
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFlashMsg({ type: 'error', text: 'Cover image exceeds maximum allowed size of 5 MB.' });
      e.target.value = '';
      return;
    }

    setFormCoverName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormCoverBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      setFlashMsg({ type: 'error', text: 'Please enter material title.' });
      return;
    }

    if (activeMode === 'create' && !formFileBase64) {
      setFlashMsg({ type: 'error', text: 'Please upload a material file.' });
      return;
    }

    try {
      setSubmitting(true);

      if (activeMode === 'create') {
        const res = await adminBusinessMaterialService.createMaterial({
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          status: formStatus,
          file: formFileBase64 || undefined,
          file_name: formFileName || undefined,
          cover_image: formCoverBase64 || undefined,
          cover_image_name: formCoverName || undefined,
        });

        setFlashMsg({ type: 'success', text: res.message || 'Business material added successfully.' });
      } else if (activeMode === 'edit' && editingMaterialId) {
        const res = await adminBusinessMaterialService.updateMaterial(editingMaterialId, {
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          status: formStatus,
          file: formFileBase64 || undefined,
          file_name: formFileName || undefined,
          cover_image: formCoverBase64 || undefined,
          cover_image_name: formCoverName || undefined,
        });

        setFlashMsg({ type: 'success', text: res.message || 'Business material updated successfully.' });
      }

      await fetchMaterials();
      handleBackToList();
    } catch (err: any) {
      console.error('[handleSubmitForm Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle status inline
  const handleToggleStatus = async (item: BusinessMaterialItem) => {
    try {
      const res = await adminBusinessMaterialService.toggleStatus(item.id);
      setMaterials((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: res.value } : m))
      );
      setFlashMsg({ type: 'success', text: res.message || 'Status updated successfully.' });
    } catch (err: any) {
      console.error('[handleToggleStatus Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to update status.' });
    }
  };

  // Delete Material
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await adminBusinessMaterialService.deleteMaterial(deleteTarget.id);
      setMaterials((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setFlashMsg({ type: 'success', text: res.message || 'Business material deleted successfully.' });
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('[handleConfirmDelete Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to delete business material.' });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(term) ||
      (m.description && m.description.toLowerCase().includes(term))
    );
  });

  // Date formatter
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

  return (
    <div className="w-full space-y-6">
      {/* =========================================================================
          CONTENT HEADER / BREADCRUMB (Matching Laravel)
          ========================================================================= */}
      <div className="content-header">
        <div className="flex items-center">
          <div className="me-auto">
            <h4 className="page-title text-xl font-bold text-slate-800">
              {activeMode === 'create'
                ? 'Add Business Material'
                : activeMode === 'edit'
                ? 'Edit Business Material'
                : 'Business Material'}
            </h4>
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
                    {activeMode === 'list' ? (
                      <span className="text-slate-700 font-semibold">Business Material</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="text-blue-600 hover:underline hover:text-slate-800 cursor-pointer"
                      >
                        Business Material
                      </button>
                    )}
                  </li>
                  {activeMode === 'create' && (
                    <>
                      <span>/</span>
                      <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                        Add Material
                      </li>
                    </>
                  )}
                  {activeMode === 'edit' && (
                    <>
                      <span>/</span>
                      <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                        Edit Material
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>
          </div>

          {/* Action button in Header */}
          {activeMode === 'list' ? (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Material
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBackToList}
              className="btn btn-sm btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          FLASH MESSAGES BANNER (Matching session('msg') / alert-dismissible)
          ========================================================================= */}
      {flashMsg && (
        <div
          className={`alert alert-dismissible px-4 py-3 rounded text-xs flex items-center justify-between border ${
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
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: LIST VIEW (Matching index.blade.php)
          ========================================================================= */}
      {activeMode === 'list' && (
        <section className="content">
          <div className="row">
            <div className="col-12 w-full">
              <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                {/* Box Header */}
                <div className="box-header with-border p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="box-title text-base font-bold text-slate-800">
                      Business Material
                    </h3>
                    <h6 className="box-subtitle text-xs text-slate-500 mt-0.5">
                      Manage business materials available to users.
                    </h6>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search materials..."
                        className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={fetchMaterials}
                      disabled={loading}
                      className="p-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Box Body */}
                <div className="box-body p-5">
                  <div className="table-responsive overflow-x-auto">
                    <table className="table table-bordered table-hover w-full text-xs border border-slate-200">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3 border-r border-slate-200 text-left w-14">Sr.No.</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 text-left w-32">Cover Image</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 text-left">Title</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 text-left w-28">File</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 text-center w-24">Status</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 text-left w-36">Created At</th>
                          <th className="py-2.5 px-3 text-center w-36">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {loading && materials.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500">
                              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                              Loading business materials...
                            </td>
                          </tr>
                        ) : filteredMaterials.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              No business material found.
                            </td>
                          </tr>
                        ) : (
                          filteredMaterials.map((material, idx) => {
                            const coverUrl = material.cover_image
                              ? buildAssetUrl(material.cover_image)
                              : null;
                            const fileUrl = material.file
                              ? buildAssetUrl(material.file)
                              : null;

                            return (
                              <tr
                                key={material.id}
                                className="hover:bg-slate-50 transition border-b border-slate-100"
                              >
                                {/* Sr. No. */}
                                <td className="py-2.5 px-3 border-r border-slate-200 font-medium text-slate-600">
                                  {idx + 1}
                                </td>

                                {/* Cover Image */}
                                <td className="py-2.5 px-3 border-r border-slate-200">
                                  {coverUrl ? (
                                    <img
                                      src={coverUrl}
                                      alt={material.title}
                                      onClick={() =>
                                        setPreviewImage({ src: coverUrl, title: material.title })
                                      }
                                      className="cursor-pointer hover:opacity-90 transition shadow-2xs"
                                      style={{
                                        width: '100px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                      }}
                                    />
                                  ) : (
                                    <span className="text-slate-400 font-medium">-</span>
                                  )}
                                </td>

                                {/* Title */}
                                <td className="py-2.5 px-3 border-r border-slate-200">
                                  <div className="font-bold text-slate-800 text-xs">{material.title}</div>
                                  {material.description && (
                                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                      {material.description}
                                    </div>
                                  )}
                                </td>

                                {/* File Link */}
                                <td className="py-2.5 px-3 border-r border-slate-200">
                                  {fileUrl ? (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-xs btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs transition"
                                    >
                                      <FileText className="w-3 h-3" /> View File
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>

                                {/* Status */}
                                <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(material)}
                                    title="Click to toggle status"
                                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                                      Number(material.status) === 1
                                        ? 'bg-[#28a745] text-white hover:bg-[#218838]'
                                        : 'bg-[#dc3545] text-white hover:bg-[#c82333]'
                                    }`}
                                  >
                                    {Number(material.status) === 1 ? 'Active' : 'Inactive'}
                                  </button>
                                </td>

                                {/* Created At */}
                                <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                                  {formatDate(material.created_at)}
                                </td>

                                {/* Actions */}
                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(material)}
                                      className="btn btn-xs btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs transition cursor-pointer"
                                    >
                                      <Edit className="w-3 h-3" /> Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setDeleteTarget(material)}
                                      className="btn btn-xs btn-danger bg-[#dc3545] hover:bg-[#c82333] text-white px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs transition cursor-pointer"
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

                  {/* Footer entries count */}
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-4">
                    <div>
                      Showing {filteredMaterials.length} of {materials.length} business materials
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 2: CREATE MATERIAL (Matching create.blade.php)
          ========================================================================= */}
      {activeMode === 'create' && (
        <section className="content">
          <div className="row">
            <div className="col-12 w-full">
              <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                {/* Box Header */}
                <div className="box-header with-border p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="box-title text-base font-bold text-slate-800">
                    Add Business Material
                  </h3>

                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="btn btn-sm btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                </div>

                {/* Box Body / Form */}
                <div className="box-body p-6">
                  <form onSubmit={handleSubmitForm} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Material Title */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Material Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Enter material title"
                          required
                          className="form-control w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Upload File */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Upload File <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          required
                          className="form-control w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
                        <small className="text-[11px] text-slate-500 block">
                          Maximum file size: 10 MB (PDF, PPT, DOC, Video)
                        </small>
                        {formFileName && (
                          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {formFileName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Cover Image */}
                      <div className="form-group space-y-1.5">
                        <label htmlFor="cover_image" className="text-xs font-bold text-slate-700">
                          Cover Image
                        </label>
                        <input
                          type="file"
                          id="cover_image"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleCoverChange}
                          className="form-control w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
                        <small className="text-[11px] text-slate-500 block">
                          Recommended: JPG, PNG, WEBP (Max: 5 MB)
                        </small>

                        {formCoverBase64 && (
                          <div className="mt-2 p-2 border border-slate-200 rounded-lg inline-block bg-slate-50">
                            <p className="text-[11px] font-bold text-slate-500 mb-1">Cover Preview:</p>
                            <img
                              src={formCoverBase64}
                              alt="Cover Preview"
                              className="w-32 h-20 object-cover rounded border border-slate-200 shadow-2xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Status
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(Number(e.target.value))}
                          className="form-control w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Description (Optional) */}
                    <div className="form-group space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Description <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Optional description of the business material..."
                        className="form-control w-full border border-slate-300 rounded p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-success bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {submitting ? 'Saving...' : 'Save Material'}
                      </button>

                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 3: EDIT MATERIAL (Matching edit.blade.php)
          ========================================================================= */}
      {activeMode === 'edit' && (
        <section className="content">
          <div className="row">
            <div className="col-12 w-full">
              <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                {/* Box Header */}
                <div className="box-header with-border p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="box-title text-base font-bold text-slate-800">
                    Edit Business Material
                  </h3>

                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="btn btn-sm btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                </div>

                {/* Box Body / Form */}
                <div className="box-body p-6">
                  <form onSubmit={handleSubmitForm} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Material Title */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Material Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Enter material title"
                          required
                          className="form-control w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Current File Display */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Current File
                        </label>
                        <div>
                          {currentFileUrl ? (
                            <a
                              href={buildAssetUrl(currentFileUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-info bg-[#17a2b8] hover:bg-[#138496] text-white px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Current File
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No file uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Replace File */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Replace File
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                        />
                        <small className="text-[11px] text-slate-500 block">
                          Leave empty if you don't want to replace the current file. Maximum 10 MB.
                        </small>
                        {formFileName && (
                          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> New file selected: {formFileName}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="form-group space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Status
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(Number(e.target.value))}
                          className="form-control w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="form-group space-y-1.5">
                      <label htmlFor="cover_image_edit" className="text-xs font-bold text-slate-700">
                        Cover Image
                      </label>

                      {currentCoverUrl && !formCoverBase64 && (
                        <div className="mb-2">
                          <p className="text-[11px] font-bold text-slate-500 mb-1">Current Cover Image:</p>
                          <img
                            src={buildAssetUrl(currentCoverUrl)}
                            alt="Current Cover"
                            className="rounded border border-slate-300 shadow-2xs"
                            style={{
                              width: '180px',
                              height: '100px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}

                      {formCoverBase64 && (
                        <div className="mb-2">
                          <p className="text-[11px] font-bold text-emerald-600 mb-1">New Cover Image Preview:</p>
                          <img
                            src={formCoverBase64}
                            alt="New Cover Preview"
                            className="rounded border border-emerald-300 shadow-2xs"
                            style={{
                              width: '180px',
                              height: '100px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        id="cover_image_edit"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleCoverChange}
                        className="form-control w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                      <small className="text-[11px] text-slate-500 block">
                        Leave empty if you don't want to change the current cover image.
                      </small>
                    </div>

                    {/* Description (Optional) */}
                    <div className="form-group space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Description <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Optional description of the business material..."
                        className="form-control w-full border border-slate-300 rounded p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-success bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {submitting ? 'Updating...' : 'Update Material'}
                      </button>

                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SWEETALERT STYLE DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">Are you sure?</h3>
            <p className="text-xs text-slate-500 mb-6">
              You will not be able to recover this business material!
              <br />
              <strong className="text-slate-700 mt-1 block">"{deleteTarget.title}"</strong>
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="bg-[#dc3545] hover:bg-[#c82333] text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete it!'}
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-5 py-2 rounded-lg text-xs font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IMAGE LIGHTBOX PREVIEW MODAL
          ========================================================================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xs animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white border-b border-slate-800">
              <span className="text-xs font-bold truncate">{previewImage.title}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
