import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package as PackageIcon,
  Plus,
  Edit,
  Gift,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
  X,
  Save,
  RefreshCw,
  Search,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  packageService,
  type AdminPackageItem,
} from '../../services/packageService';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';
import { buildAssetUrl } from '../../config/api';

/**
 * Robust Package Avatar with automatic image load error handling and fallback
 */
const PackageAvatar: React.FC<{
  imageUrl?: string | null;
  imageName?: string | null;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ imageUrl, imageName, title, size = 'md' }) => {
  const [hasError, setHasError] = useState(false);
  const rawPath = imageUrl || (imageName ? `/uploads/package/${imageName}` : '');
  const finalSrc = buildAssetUrl(rawPath);

  useEffect(() => {
    setHasError(false);
  }, [finalSrc]);

  const sizeClasses =
    size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  if (!finalSrc || hasError) {
    return (
      <div
        className={`${sizeClasses} rounded-xl bg-orange-50 border border-orange-200 text-[#ff7a1a] flex items-center justify-center font-bold shrink-0 shadow-2xs`}
        title={title}
      >
        <Gift className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={title}
      className={`${sizeClasses} rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0`}
      onError={() => setHasError(true)}
    />
  );
};

export const PackagesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useGeneralSettings();
  const currencySymbol = settings?.symbol || '$';

  // Determine active tab from route
  const activeTab = useMemo<'donations' | 'credits'>(() => {
    return location.pathname.includes('/credits') ? 'credits' : 'donations';
  }, [location.pathname]);

  // Packages state
  const [packages, setPackages] = useState<AdminPackageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPack, setEditingPack] = useState<AdminPackageItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formDailyLimit, setFormDailyLimit] = useState<number>(2);
  const [formStatus, setFormStatus] = useState<number>(1);
  const [formImageBase64, setFormImageBase64] = useState<string>('');
  const [formImagePreview, setFormImagePreview] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load packages from API
  const loadPackages = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await packageService.getAllPackages();
      setPackages(data.packages || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load donation packages.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Open modal if URL has ?action=add or ?edit=:id
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'add') {
      openAddModal();
    } else if (editId && packages.length > 0) {
      const target = packages.find((p) => p.id === Number(editId));
      if (target) {
        openEditModal(target);
      }
    }
  }, [searchParams, packages]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingPack(null);
    setFormTitle('');
    setFormPrice(100);
    setFormDailyLimit(2);
    setFormStatus(1);
    setFormImageBase64('');
    setFormImagePreview('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (pack: AdminPackageItem) => {
    setEditingPack(pack);
    setFormTitle(pack.title);
    setFormPrice(pack.price);
    setFormDailyLimit(pack.daily_limit);
    setFormStatus(pack.statusCode);
    setFormImageBase64('');
    setFormImagePreview(buildAssetUrl(pack.imageUrl || (pack.image ? `/uploads/package/${pack.image}` : '')));
    setFormError('');
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPack(null);
    setFormError('');
    setFormImageBase64('');
    setFormImagePreview('');
    if (searchParams.get('action') || searchParams.get('edit')) {
      setSearchParams({});
    }
  };

  // Handle Image Upload Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Image size exceeds 2MB limit.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormImageBase64(base64);
      setFormImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Form Save
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Package Name is required.');
      return;
    }
    if (formPrice < 1) {
      setFormError('Donation Price must be at least 1.00.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingPack) {
        // Update package
        const updated = await packageService.updatePackage(editingPack.id, {
          title: formTitle.trim(),
          price: formPrice,
          daily_limit: formDailyLimit,
          status: formStatus,
          imageBase64: formImageBase64 || undefined,
        });
        showToast(`Package "${updated.title}" updated successfully!`);
      } else {
        // Create package
        const created = await packageService.createPackage({
          title: formTitle.trim(),
          price: formPrice,
          daily_limit: formDailyLimit,
          status: formStatus,
          imageBase64: formImageBase64 || undefined,
        });
        showToast(`New donation package "${created.title}" created successfully!`);
      }
      closeModal();
      await loadPackages(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (pack: AdminPackageItem) => {
    try {
      const res = await packageService.togglePackageStatus(pack.id);
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pack.id
            ? { ...p, status: res.status as 'Active' | 'Disabled', statusCode: res.statusCode }
            : p
        )
      );
      showToast(`Package "${pack.title}" status changed to ${res.status}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update package status.', 'error');
    }
  };

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (!searchTerm.trim()) return packages;
    const term = searchTerm.toLowerCase();
    return packages.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        String(p.price).includes(term) ||
        p.status.toLowerCase().includes(term)
    );
  }, [packages, searchTerm]);

  // Export to Excel
  const handleExportExcel = () => {
    const headers = [
      '#',
      'Package Name',
      'Slug',
      'Donation Price',
      'Required Credit',
      'Target Payout (2x)',
      'Daily Limit',
      'Status',
    ];
    const rows = filteredPackages.map((p, idx) => [
      idx + 1,
      p.title,
      p.slug,
      `${currencySymbol}${p.price.toFixed(2)}`,
      `${currencySymbol}${p.creditCost.toFixed(2)}`,
      `${currencySymbol}${p.targetPayout.toFixed(2)}`,
      p.dailyLimitLabel,
      p.status,
    ]);
    exportTableToExcel(headers, rows, activeTab === 'donations' ? 'donation_packages' : 'credit_packages');
  };

  // Export to PDF
  const handleExportPDF = () => {
    const headers = [
      '#',
      'Package Name',
      'Donation Price',
      'Required Credit',
      'Target Payout',
      'Daily Limit',
      'Status',
    ];
    const rows = filteredPackages.map((p, idx) => [
      idx + 1,
      p.title,
      `${currencySymbol}${p.price.toFixed(2)}`,
      `${currencySymbol}${p.creditCost.toFixed(2)}`,
      `${currencySymbol}${p.targetPayout.toFixed(2)}`,
      p.dailyLimitLabel,
      p.status,
    ]);
    exportTableToPDF(
      activeTab === 'donations' ? 'Helping Plan Donation Packages' : 'Credit Packages Rate Table',
      headers,
      rows,
      'packages_report'
    );
  };

  // Live preview values inside modal: Strictly 10% of donation price
  const modalCreditFee = (formPrice * 0.10).toFixed(2);
  const modalTargetPayout = (formPrice * 2).toFixed(2);

  return (
    <div className="w-full space-y-5 pb-14">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition transform animate-in fade-in slide-in-from-top-4 ${toastMessage.type === 'success'
              ? 'bg-[#0c2c23] text-white border-emerald-500/40'
              : 'bg-rose-900 text-white border-rose-500/40'
            }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGE HEADER & ACTIONS (MATCHING LARAVEL BOX HEADER) */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-[#ff7a1a]" />
              {activeTab === 'donations' ? 'Helping Plan Donation Packages' : 'Entry Packages & Credit Rates'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#172b4c]/10 text-[#172b4c]">
              {packages.length} Tiers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'donations'
              ? 'Manage donation tiers, required Credit, and FIFO payout targets.'
              : 'Credits are dynamically generated for each entry donation package tier (10% activation fee).'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/packages/donations')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'donations'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Donations Packages
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/packages/credits')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'credits'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Credit Packages
            </button>
          </div>

          {/* Live Refresh Button */}
          <button
            type="button"
            onClick={() => loadPackages(true)}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs cursor-pointer"
            title="Refresh package tiers"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff7a1a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Message with Retry */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between text-rose-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => loadPackages(true)}
            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* PACKAGES TABLE (MATCHING LARAVEL BLADE 100%) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search package name, price, status..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#172b4c]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-2xs cursor-pointer"
              title="Export table data to Excel (.csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition shadow-2xs cursor-pointer"
              title="Export table data to printable PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4 w-12 text-center">#</th>
                <th className="py-2.5 px-4">Package Name</th>
                <th className="py-2.5 px-4">Donation Price</th>
                <th className="py-2.5 px-4">Required Credit</th>
                <th className="py-2.5 px-4">Target Payout (2x)</th>
                <th className="py-2.5 px-4">Daily Limit</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading && packages.length === 0 ? (
                // Skeleton Rows
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-5 px-5 text-center"><div className="h-4 w-4 bg-slate-200 rounded mx-auto" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                    <td className="py-5 px-5"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-5 w-16 bg-slate-200 rounded-full mx-auto" /></td>
                    <td className="py-5 px-5 text-center"><div className="h-6 w-16 bg-slate-200 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : filteredPackages.length > 0 ? (
                filteredPackages.map((pack, idx) => (
                  <tr key={pack.id} className="hover:bg-slate-50/80 transition">
                    {/* Index */}
                    <td className="py-2.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Package Name & Badge (Matching Laravel index.blade.php lines 71-77) */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <PackageAvatar
                          imageUrl={pack.imageUrl}
                          imageName={pack.image}
                          title={pack.title}
                          size="sm"
                        />
                        <div>
                          <strong className="text-slate-900 text-xs sm:text-sm block font-bold">
                            {pack.title}
                          </strong>
                          <span className="text-slate-400 text-[10px] font-mono">
                            Slug: {pack.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Donation Price */}
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {currencySymbol}{pack.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Required Credit (Strictly 10% of Package Price) */}
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {currencySymbol}{pack.creditCost.toFixed(2)}
                      </span>
                      <small className="text-slate-500 block text-[9px] mt-0.5 font-semibold">
                        Activation (10%)
                      </small>
                    </td>

                    {/* Target Payout */}
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {currencySymbol}{pack.targetPayout.toFixed(2)}
                      </span>
                      <small className="text-slate-500 block text-[9px] mt-0.5 font-semibold">
                        from 2 Donors
                      </small>
                    </td>

                    {/* Daily Limit */}
                    <td className="py-2.5 px-4">
                      {pack.daily_limit > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Clock className="w-3 h-3" />
                          {pack.daily_limit}x / day
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600">
                          Unlimited
                        </span>
                      )}
                    </td>

                    {/* Status with Clickable Toggle */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pack)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer ${pack.statusCode === 1
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                      >
                        {pack.statusCode === 1 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Edit (Matching Laravel index.blade.php lines 120-126) */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(pack)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition cursor-pointer"
                        title="Edit Package"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-5 text-center text-slate-400 font-semibold">
                    No packages match your search query. Click "Add New Package" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            Showing <strong className="text-slate-900">{filteredPackages.length}</strong> of{' '}
            <strong className="text-slate-900">{packages.length}</strong> package tiers
          </div>
          <div className="text-[11px] text-slate-400">
            Sequential 2:1 FIFO Engine Protocol Active
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT PACKAGE MODAL (MATCHING LARAVEL add.blade.php) */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff7a1a] flex items-center justify-center font-bold">
                  {editingPack ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingPack ? `Edit Donation Package: ${editingPack.title}` : 'Create New Donation Package'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure tier price, required activation fee, and limits.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePackage} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Package Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Package Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. $100 Donation"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#172b4c] font-medium"
                />
              </div>

              {/* Donation Price & Daily Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Donation Price ({currencySymbol}) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    placeholder="100.00"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#172b4c] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Daily Donation Limit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={formDailyLimit}
                      onChange={(e) => setFormDailyLimit(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#172b4c] font-bold"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold">
                      times / day
                    </span>
                  </div>
                  <small className="text-[10px] text-slate-400 mt-0.5 block">
                    0 = Unlimited donations per day.
                  </small>
                </div>
              </div>

              {/* Live Preview Cards (Strictly 10% Required Credit Fee) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">
                    Estimated Credit Fee (10%)
                  </span>
                  <div className="text-lg font-black text-amber-600 mt-0.5">
                    {currencySymbol}{modalCreditFee}
                  </div>
                  <small className="text-[10px] text-slate-400 block font-medium">
                    10% activation fee
                  </small>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">
                    Expected 2x Payout Target
                  </span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    {currencySymbol}{modalTargetPayout}
                  </div>
                  <small className="text-[10px] text-slate-400 block font-medium">
                    from 2 matching donors
                  </small>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#172b4c] font-semibold text-slate-800"
                >
                  <option value={1}>Active (Accepting Donations)</option>
                  <option value={0}>Disabled (Coming Soon / Inactive)</option>
                </select>
              </div>

              {/* Package Badge / Image (Matching Laravel add.blade.php lines 117-127) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Package Badge / Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#172b4c] file:text-white hover:file:bg-[#172b4c]/90 cursor-pointer border border-slate-200 rounded-xl"
                />
                {formImagePreview && (
                  <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={buildAssetUrl(formImagePreview)}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="text-xs text-slate-600">
                      <strong className="block text-slate-800">
                        {formImageBase64 ? 'New Image Selected' : 'Current Package Image'}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {formImageBase64 ? 'Will be updated upon saving' : 'Image currently active for this tier'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#172b4c] to-[#0c2c23] hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPack ? 'Update Package' : 'Save Package'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesPage;
