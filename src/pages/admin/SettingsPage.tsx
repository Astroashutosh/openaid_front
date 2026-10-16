import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  BookOpen,
  Sliders,
  Shield,
  Pencil,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Copy,
  Send,
  Lock,
  Save,
  Medal,
  RefreshCw,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { buildAssetUrl } from '../../config/api';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';
import {
  adminSettingsService,
  type RankItem,
  type LevelItem,
} from '../../services/adminSettingsService';

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSettings } = useGeneralSettings();

  // Helper to format logo/qrcode asset URL with cache-busting
  const getLogoUrl = (name?: string | null): string => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:')) return name;
    const path = name.startsWith('uploads/') ? name : `uploads/logo/${name}`;
    return `${buildAssetUrl(path)}?v=${Date.now()}`;
  };

  // Determine active view based on current URL
  const getActiveView = () => {
    const p = location.pathname;
    if (p.includes('/charge') || p.includes('/charges')) return 'charges';
    if (p.includes('/rank') || p.includes('/ranks')) return 'ranks';
    if (p.includes('/level') || p.includes('/levels')) return 'levels';
    if (p.includes('/payment')) return 'payment';
    return 'general';
  };

  const activeView = getActiveView();

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // =========================================================================
  // 1. GENERAL SETTINGS STATE
  // =========================================================================
  const [generalForm, setGeneralForm] = useState({
    webTitle: 'OpenAid International',
    currency: 'USD',
    symbol: '$',
    logo: '',
    favicon: '',
  });
  const [newLogoBase64, setNewLogoBase64] = useState<string | null>(null);
  const [newFaviconBase64, setNewFaviconBase64] = useState<string | null>(null);

  const fetchGeneralSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getGeneralSettings();
      if (data) {
        setGeneralForm({
          webTitle: data.web_title || '',
          currency: data.currency || 'USD',
          symbol: data.symbol || '$',
          logo: data.logo || '',
          favicon: data.icon || '',
        });
      }
    } catch (err: any) {
      console.error('[fetchGeneralSettings Error]', err);
      showToast(err?.message || 'Failed to load general settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewLogoBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewFaviconBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminSettingsService.updateGeneralSettings({
        web_title: generalForm.webTitle,
        currency: generalForm.currency,
        symbol: generalForm.symbol,
        logo: newLogoBase64 || undefined,
        favicon: newFaviconBase64 || undefined,
      });
      showToast(res.message || 'General settings updated successfully!');
      setNewLogoBase64(null);
      setNewFaviconBase64(null);
      await fetchGeneralSettings();
      await refreshSettings();
    } catch (err: any) {
      console.error('[handleGeneralSubmit Error]', err);
      showToast(err?.message || 'Failed to update general settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // 2. CHARGES & LIMITS STATE
  // =========================================================================
  const [chargeForm, setChargeForm] = useState({
    withdrawEnabled: true,
    withdrawFee: '2',
    minWithdraw: '4',
  });

  const fetchChargeSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getChargeSettings();
      if (data) {
        setChargeForm({
          withdrawEnabled: data.is_withdraw_enable === 'yes' || (data.is_withdraw_enable as any) === true,
          withdrawFee: String(data.withdraw_fee || '0'),
          minWithdraw: String(data.min_withdraw || '0'),
        });
      }
    } catch (err: any) {
      console.error('[fetchChargeSettings Error]', err);
      showToast(err?.message || 'Failed to load charge settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminSettingsService.updateChargeSettings({
        withdraw_fee: parseFloat(chargeForm.withdrawFee) || 0,
        min_withdraw: parseFloat(chargeForm.minWithdraw) || 0,
        is_withdraw_enable: chargeForm.withdrawEnabled ? 'yes' : 'no',
      });
      showToast(res.message || 'Charges & Fees updated successfully!');
      await fetchChargeSettings();
    } catch (err: any) {
      console.error('[handleChargeSubmit Error]', err);
      showToast(err?.message || 'Failed to update charge settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // 3. RANK SETTINGS STATE
  // =========================================================================
  const [ranks, setRanks] = useState<RankItem[]>([]);
  const [editingRank, setEditingRank] = useState<RankItem | null>(null);
  const [rankFormData, setRankFormData] = useState({
    rank_name: '',
    directs: 0,
    referral_commission: 0,
    reward_amount: 0,
    reward_name_text: '',
  });

  const fetchRanks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getRanks();
      setRanks(data);
    } catch (err: any) {
      console.error('[fetchRanks Error]', err);
      showToast(err?.message || 'Failed to load rank settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const openRankEditModal = (rank: RankItem) => {
    setEditingRank(rank);
    const rewardList = rank.reward_name_array || [];
    setRankFormData({
      rank_name: rank.rank_name,
      directs: rank.directs,
      referral_commission: rank.referral_commission,
      reward_amount: rank.reward_amount,
      reward_name_text: rewardList.length > 0 ? rewardList.join(', ') : rank.reward_name,
    });
  };

  const handleRankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;

    try {
      setSaving(true);
      const parsedOptions = rankFormData.reward_name_text
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await adminSettingsService.updateRank(editingRank.id, {
        rank_name: rankFormData.rank_name,
        directs: Number(rankFormData.directs),
        referral_commission: Number(rankFormData.referral_commission),
        reward_amount: Number(rankFormData.reward_amount),
        reward_name: parsedOptions,
      });

      showToast(res.message || `Rank setting for "${rankFormData.rank_name}" updated successfully!`);
      setEditingRank(null);
      await fetchRanks();
    } catch (err: any) {
      console.error('[handleRankSave Error]', err);
      showToast(err?.message || 'Failed to update rank setting.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // 4. LEVEL COMMISSIONS STATE
  // =========================================================================
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);
  const [levelFormData, setLevelFormData] = useState({
    direct_referrals: 0,
    commission: 0,
  });

  const fetchLevels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getLevels();
      setLevels(data);
    } catch (err: any) {
      console.error('[fetchLevels Error]', err);
      showToast(err?.message || 'Failed to load level commissions.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const openLevelEditModal = (level: LevelItem) => {
    setEditingLevel(level);
    setLevelFormData({
      direct_referrals: level.direct_referrals,
      commission: level.commission,
    });
  };

  const handleLevelSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;

    try {
      setSaving(true);
      const res = await adminSettingsService.updateLevel(editingLevel.id, {
        direct_referrals: Number(levelFormData.direct_referrals),
        commission: Number(levelFormData.commission),
      });

      showToast(res.message || `Level ${editingLevel.id} commission updated successfully!`);
      setEditingLevel(null);
      await fetchLevels();
    } catch (err: any) {
      console.error('[handleLevelSave Error]', err);
      showToast(err?.message || 'Failed to update level commission.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // 5. PAYMENT SETTINGS STATE
  // =========================================================================
  const [paymentForm, setPaymentForm] = useState({
    adminUsdtAddress: '',
    qrcode: '',
    companyUsdtAddress: '',
    companyWithdrawUsdtAddress: '',
    maskedAdminEmail: 'adm***@gmail.com',
    depositOtp: '',
    privateKey: '',
    withdrawOtp: '',
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [depositOtpSent, setDepositOtpSent] = useState(false);
  const [withdrawOtpSent, setWithdrawOtpSent] = useState(false);
  const [generatedDepositOtp, setGeneratedDepositOtp] = useState<string | null>(null);
  const [generatedWithdrawOtp, setGeneratedWithdrawOtp] = useState<string | null>(null);
  const [newQrCodeBase64, setNewQrCodeBase64] = useState<string | null>(null);

  const fetchPaymentSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminSettingsService.getPaymentSettings();
      if (data) {
        setPaymentForm((prev) => ({
          ...prev,
          adminUsdtAddress: data.admin_usdt_address || '',
          qrcode: data.qrcode || '',
          companyUsdtAddress: data.company_usdt_address || '',
          companyWithdrawUsdtAddress: data.company_withdraw_usdt_address || '',
          maskedAdminEmail: data.masked_admin_email || 'adm***@gmail.com',
        }));
      }
    } catch (err: any) {
      console.error('[fetchPaymentSettings Error]', err);
      showToast(err?.message || 'Failed to load payment settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewQrCodeBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendDepositOtp = async () => {
    try {
      const res = await adminSettingsService.sendPaymentOtp();
      setDepositOtpSent(true);
      if (res.otp) {
        setGeneratedDepositOtp(res.otp);
        showToast(`OTP sent to ${paymentForm.maskedAdminEmail}! Dev code: ${res.otp}`);
      } else {
        showToast(res.message || `OTP sent to ${paymentForm.maskedAdminEmail}!`);
      }
    } catch (err: any) {
      console.error('[sendDepositOtp Error]', err);
      showToast(err?.message || 'Failed to send OTP.', 'error');
    }
  };

  const sendWithdrawOtp = async () => {
    try {
      const res = await adminSettingsService.sendPaymentOtp();
      setWithdrawOtpSent(true);
      if (res.otp) {
        setGeneratedWithdrawOtp(res.otp);
        showToast(`OTP sent to ${paymentForm.maskedAdminEmail}! Dev code: ${res.otp}`);
      } else {
        showToast(res.message || `OTP sent to ${paymentForm.maskedAdminEmail}!`);
      }
    } catch (err: any) {
      console.error('[sendWithdrawOtp Error]', err);
      showToast(err?.message || 'Failed to send OTP.', 'error');
    }
  };

  const copyAddress = (val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    showToast('Address copied to clipboard!');
  };

  const handleDepositAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.depositOtp.trim()) {
      showToast('Please enter the 6-digit OTP sent to your admin email.', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await adminSettingsService.updatePaymentSettings({
        otp: paymentForm.depositOtp.trim(),
        admin_usdt_address: paymentForm.adminUsdtAddress.trim(),
        qrcode: newQrCodeBase64 || undefined,
      });

      showToast(res.message || 'Donate Wallet Address updated successfully!');
      setDepositOtpSent(false);
      setGeneratedDepositOtp(null);
      setNewQrCodeBase64(null);
      setPaymentForm((prev) => ({ ...prev, depositOtp: '' }));
      await fetchPaymentSettings();
    } catch (err: any) {
      console.error('[handleDepositAddressSave Error]', err);
      showToast(err?.message || 'Failed to update payment settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleWithdrawKeySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.withdrawOtp.trim()) {
      showToast('Please enter the 6-digit OTP sent to your admin email.', 'error');
      return;
    }

    if (!paymentForm.privateKey.trim()) {
      showToast('Please enter a private key to update.', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await adminSettingsService.updatePaymentSettings({
        otp: paymentForm.withdrawOtp.trim(),
        private_key: paymentForm.privateKey.trim(),
      });

      showToast(res.message || 'Withdraw Wallet Private Key updated successfully!');
      setWithdrawOtpSent(false);
      setGeneratedWithdrawOtp(null);
      setPaymentForm((prev) => ({ ...prev, withdrawOtp: '', privateKey: '' }));
      await fetchPaymentSettings();
    } catch (err: any) {
      console.error('[handleWithdrawKeySave Error]', err);
      showToast(err?.message || 'Failed to update private key.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Fetch data on active view change
  useEffect(() => {
    if (activeView === 'general') fetchGeneralSettings();
    else if (activeView === 'charges') fetchChargeSettings();
    else if (activeView === 'ranks') fetchRanks();
    else if (activeView === 'levels') fetchLevels();
    else if (activeView === 'payment') fetchPaymentSettings();
  }, [activeView, fetchGeneralSettings, fetchChargeSettings, fetchRanks, fetchLevels, fetchPaymentSettings]);

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#172b4c] text-white border-white/20'
              : 'bg-rose-900 text-white border-rose-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#ffa800]" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* Content Header (Matching Laravel Breadcrumb & Page Title) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#ffa800]" />
            <h2 className="text-xl font-bold text-slate-800">
              {activeView === 'general' && 'General Setting'}
              {activeView === 'charges' && 'Charges & Commission Setting'}
              {activeView === 'ranks' && 'Rank & Rewards'}
              {activeView === 'levels' && 'Level Commission'}
              {activeView === 'payment' && 'Payment Setting'}
            </h2>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#ffa800] font-semibold">
              {activeView === 'general' && 'General'}
              {activeView === 'charges' && 'Setting'}
              {activeView === 'ranks' && 'Rank Settings'}
              {activeView === 'levels' && 'Level Commission'}
              {activeView === 'payment' && 'Setting'}
            </span>
          </div>
        </div>

        {/* Dedicated URL Page Navigation Tabs (Matching Laravel Sidebar Settings Menu) */}
        <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => navigate('/admin/settings/general')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeView === 'general'
                ? 'bg-[#172b4c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            General Settings
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/settings/charges')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeView === 'charges'
                ? 'bg-[#172b4c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Charge &amp; Limits
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/settings/ranks')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeView === 'ranks'
                ? 'bg-[#172b4c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Rank Setting
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/settings/levels')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeView === 'levels'
                ? 'bg-[#172b4c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Level Commission
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/settings/payment')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeView === 'payment'
                ? 'bg-[#172b4c] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Payment Setting
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
          <p className="text-xs font-medium text-slate-500">Loading settings...</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GENERAL SETTINGS PAGE (Matching manage/admin/general/index.blade.php) */}
      {/* ========================================================================= */}
      {!loading && activeView === 'general' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">General Setting</h4>
          </div>

          <form onSubmit={handleGeneralSubmit} className="p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-sky-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> General Information
              </h4>
            </div>

            {/* Row 1: Website Name, Currency, Currency Symbol */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Website Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="web_title"
                  required
                  value={generalForm.webTitle}
                  onChange={(e) => setGeneralForm({ ...generalForm, webTitle: e.target.value })}
                  placeholder="Website Name"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Currency <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="currency"
                  required
                  value={generalForm.currency}
                  onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
                  placeholder="Currency Code (USD)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Currency Symbol <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="symbol"
                  required
                  value={generalForm.symbol}
                  onChange={(e) => setGeneralForm({ ...generalForm, symbol: e.target.value })}
                  placeholder="Currency Symbol ($)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800]"
                />
              </div>
            </div>

            {/* Row 2: Logos & Favicon */}
            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Logo */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Light Logo</label>
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center min-h-[90px] shadow-xs">
                  {newLogoBase64 ? (
                    <img src={newLogoBase64} alt="New Logo Preview" className="max-h-14 max-w-[200px] object-contain" />
                  ) : generalForm.logo ? (
                    <img src={getLogoUrl(generalForm.logo)} alt="Logo" className="max-h-14 max-w-[200px] object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">No Logo Uploaded</span>
                  )}
                </div>
                <i className="text-[11px] text-amber-700 font-medium block">
                  <b>Note:</b> Recommended logo size is 246x64px in PNG or JPG format.
                </i>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Favicon</label>
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center min-h-[90px] shadow-xs">
                  {newFaviconBase64 ? (
                    <img src={newFaviconBase64} alt="New Favicon Preview" className="w-10 h-10 object-contain" />
                  ) : generalForm.favicon ? (
                    <img src={getLogoUrl(generalForm.favicon)} alt="Favicon" className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">No Favicon Uploaded</span>
                  )}
                </div>
                <i className="text-[11px] text-slate-500 font-medium block">
                  <b>Note:</b> Square icon/favicon for browser tab and collapsed sidebar navigation.
                </i>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/x-icon,image/svg+xml"
                  onChange={handleFaviconFileChange}
                  className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHARGES & LIMITS PAGE (Matching manage/admin/general/charge.blade.php) */}
      {/* ========================================================================= */}
      {!loading && activeView === 'charges' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Charges &amp; Fees</h4>
          </div>

          <form onSubmit={handleChargeSubmit} className="p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-sky-600 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Withdrawal &amp; Platform Limits
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Withdraw Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Withdraw Status</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="withdraw_enabled"
                      checked={chargeForm.withdrawEnabled}
                      onChange={() => setChargeForm({ ...chargeForm, withdrawEnabled: true })}
                      className="accent-[#28a745] w-4 h-4"
                    />
                    <span>Enabled</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="withdraw_enabled"
                      checked={!chargeForm.withdrawEnabled}
                      onChange={() => setChargeForm({ ...chargeForm, withdrawEnabled: false })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    <span>Disabled</span>
                  </label>
                </div>
              </div>

              {/* Withdraw Processing Fee (%) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Withdraw Fee (%) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="withdraw_fee"
                    required
                    value={chargeForm.withdrawFee}
                    onChange={(e) => setChargeForm({ ...chargeForm, withdrawFee: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              {/* Minimum Withdraw Amount ($) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Withdraw Amount <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="min_withdraw"
                    required
                    value={chargeForm.minWithdraw}
                    onChange={(e) => setChargeForm({ ...chargeForm, minWithdraw: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800] pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RANK SETTING PAGE (Matching manage/admin/general/rank_setting.blade.php) */}
      {/* ========================================================================= */}
      {!loading && activeView === 'ranks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Rank &amp; Rewards</h4>
            <span className="text-xs text-slate-500 font-medium">Click "Edit" on any rank to update criteria &amp; rewards</span>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#172b4c] text-white font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 border-r border-white/10">ID</th>
                    <th className="py-3 px-4 border-r border-white/10">Rank Name</th>
                    <th className="py-3 px-4 border-r border-white/10">Direct Sponsors</th>
                    <th className="py-3 px-4 border-r border-white/10">Team Volume / Ref. Comm ($)</th>
                    <th className="py-3 px-4 border-r border-white/10">Reward Amount ($)</th>
                    <th className="py-3 px-4 border-r border-white/10">Gadget / Physical Rewards</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranks.map((rank) => {
                    const rewards = rank.reward_name_array || [];
                    return (
                      <tr key={rank.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-600 border-r border-slate-100">{rank.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <Medal className="w-3.5 h-3.5 text-[#ffa800]" />
                            {rank.rank_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 font-semibold text-slate-700">
                          {rank.directs} Directs
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 font-semibold text-emerald-600">
                          ${rank.referral_commission.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 font-bold text-emerald-700">
                          ${rank.reward_amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-600 max-w-xs">
                          {rewards.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {rewards.map((rw, i) => (
                                <span
                                  key={i}
                                  className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium"
                                >
                                  {rw}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">{rank.reward_name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openRankEditModal(rank)}
                            className="bg-[#007bff] hover:bg-[#0069d9] text-white px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rank Edit Modal */}
      {editingRank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Medal className="w-4 h-4 text-[#ffa800]" /> Edit Rank: {editingRank.rank_name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRank(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRankSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rank Name *</label>
                <input
                  type="text"
                  required
                  value={rankFormData.rank_name}
                  onChange={(e) => setRankFormData({ ...rankFormData, rank_name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Directs *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={rankFormData.directs}
                    onChange={(e) => setRankFormData({ ...rankFormData, directs: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Referral Commission ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={rankFormData.referral_commission}
                    onChange={(e) =>
                      setRankFormData({ ...rankFormData, referral_commission: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cash Reward Amount ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={rankFormData.reward_amount}
                  onChange={(e) => setRankFormData({ ...rankFormData, reward_amount: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reward Items (comma-separated options) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rankFormData.reward_name_text}
                  onChange={(e) => setRankFormData({ ...rankFormData, reward_name_text: e.target.value })}
                  placeholder="e.g. Electric blender, Electric kettle, Rice cooker, Standing fan"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRank(null)}
                  className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Rank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LEVEL COMMISSION PAGE (manage/admin/general/level_setting.blade.php) */}
      {/* ========================================================================= */}
      {!loading && activeView === 'levels' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">Level Commission Setting</h4>
            <span className="text-xs text-slate-500 font-medium">8 Generational Matrix Tiers</span>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#172b4c] text-white font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 border-r border-white/10">Level</th>
                    <th className="py-3 px-4 border-r border-white/10">Direct Referrals Required</th>
                    <th className="py-3 px-4 border-r border-white/10">Commission Percentage (%)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levels.map((level) => (
                    <tr key={level.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100">
                        Level {level.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 border-r border-slate-100">
                        {level.direct_referrals} {level.direct_referrals === 1 ? 'Direct' : 'Directs'}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 border-r border-slate-100">
                        {level.commission}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openLevelEditModal(level)}
                          className="bg-[#007bff] hover:bg-[#0069d9] text-white px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Level Edit Modal */}
      {editingLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Edit Level {editingLevel.id} Commission
              </h3>
              <button
                type="button"
                onClick={() => setEditingLevel(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLevelSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Referrals Required *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={levelFormData.direct_referrals}
                  onChange={(e) =>
                    setLevelFormData({ ...levelFormData, direct_referrals: Number(e.target.value) })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Commission Percentage (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={levelFormData.commission}
                    onChange={(e) =>
                      setLevelFormData({ ...levelFormData, commission: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLevel(null)}
                  className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAYMENT SETTING PAGE (Matching manage/admin/general/payment_setting.blade.php) */}
      {/* ========================================================================= */}
      {!loading && activeView === 'payment' && (
        <div className="space-y-6">
          {/* Card 1: Donate Address Setting */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Donate Address Setting</h4>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" /> OTP Protected
              </span>
            </div>

            <form onSubmit={handleDepositAddressSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin USDT BEP20 Address (For User Deposit) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={paymentForm.adminUsdtAddress}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, adminUsdtAddress: e.target.value })
                    }
                    placeholder="Enter BEP20 USDT Address (0x...)"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => copyAddress(paymentForm.adminUsdtAddress)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    title="Copy Address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* QR Code Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  USDT QR Code Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl w-24 h-24 flex items-center justify-center shrink-0">
                    {newQrCodeBase64 ? (
                      <img
                        src={newQrCodeBase64}
                        alt="New QR Code Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : paymentForm.qrcode ? (
                      <img
                        src={getLogoUrl(paymentForm.qrcode)}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrFileChange}
                      className="text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    <small className="text-[11px] text-slate-500 block">
                      Optional: Replace the receiving USDT QR Code image displayed to members
                    </small>
                  </div>
                </div>
              </div>

              {/* OTP Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Security Verification</span>
                    <span className="text-[11px] text-slate-500">
                      OTP will be sent to registered email: <strong>{paymentForm.maskedAdminEmail}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={sendDepositOtp}
                    className="bg-[#172b4c] hover:bg-[#0f1d33] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-[#ffa800]" />
                    {depositOtpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {depositOtpSent && (
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={paymentForm.depositOtp}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, depositOtp: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="Enter 6-digit OTP"
                      className="text-xs font-bold tracking-widest text-center px-4 py-2 rounded-lg border border-slate-300 bg-white w-44 outline-none focus:border-[#ffa800]"
                    />
                    {generatedDepositOtp && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Dev OTP: {generatedDepositOtp}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || !depositOtpSent}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Donate Address'}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Withdraw Private Key Setting */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-800">Withdraw Wallet Private Key Setting</h4>
              <span className="text-xs bg-rose-50 text-rose-800 font-bold px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600" /> High Security
              </span>
            </div>

            <form onSubmit={handleWithdrawKeySave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Withdraw Wallet Private Key <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={paymentForm.privateKey}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, privateKey: e.target.value })
                    }
                    placeholder="Enter new Private Key (encrypted before storage)"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800] pr-16"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="hover:text-slate-700"
                      title={showPrivateKey ? 'Hide' : 'Show'}
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <small className="text-[11px] text-slate-500 mt-1 block">
                  Keys are cryptographically protected and never exposed in plain text.
                </small>
              </div>

              {/* OTP Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Security Verification</span>
                    <span className="text-[11px] text-slate-500">
                      OTP will be sent to registered email: <strong>{paymentForm.maskedAdminEmail}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={sendWithdrawOtp}
                    className="bg-[#172b4c] hover:bg-[#0f1d33] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-[#ffa800]" />
                    {withdrawOtpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {withdrawOtpSent && (
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={paymentForm.withdrawOtp}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, withdrawOtp: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="Enter 6-digit OTP"
                      className="text-xs font-bold tracking-widest text-center px-4 py-2 rounded-lg border border-slate-300 bg-white w-44 outline-none focus:border-[#ffa800]"
                    />
                    {generatedWithdrawOtp && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Dev OTP: {generatedWithdrawOtp}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || !withdrawOtpSent || !paymentForm.privateKey.trim()}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Private Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
