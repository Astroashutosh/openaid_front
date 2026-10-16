import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  adminMemberService,
  type MemberProfileData,
  type MemberCountry,
} from '../../services/adminMemberService';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Award,
  Users,
} from 'lucide-react';

export const MemberUpdateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<MemberProfileData | null>(null);
  const [countries, setCountries] = useState<MemberCountry[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form fields state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    country: '',
    address: '',
    city: '',
    state: '',
    district: '',
    bank_name: '',
    bank_branch: '',
    account_no: '',
    account_holder_name: '',
    account_type: '',
    bank_code: '',
    nric_number: '',
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [profileData, countryList] = await Promise.all([
          adminMemberService.getProfile(id),
          adminMemberService.getCountries(),
        ]);

        setProfile(profileData);
        setCountries(countryList);

        setFormData({
          first_name: profileData.firstName || '',
          last_name: profileData.lastName || '',
          email: profileData.email || '',
          phone_no: profileData.phone || '',
          country: String(profileData.countryId || ''),
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          district: profileData.district || '',
          bank_name: profileData.bankName || '',
          bank_branch: profileData.bankBranch || '',
          account_no: profileData.accountNo || '',
          account_holder_name: profileData.accountHolderName || '',
          account_type: profileData.accountType || '',
          bank_code: profileData.bankCode || '',
          nric_number: profileData.nricNumber || '',
        });

        if (profileData.imageUrl) {
          setImagePreview(profileData.imageUrl);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load member profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle photo file selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must not exceed 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Submit update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.first_name.trim()) {
      showToast('First Name is required', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Email address is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone_no: formData.phone_no.trim(),
      };

      if (imageBase64) {
        payload.image = imageBase64;
      }

      const res = await adminMemberService.updateProfile(id, payload);
      showToast(res.message || 'Profile updated successfully!');

      // Refresh data
      const updatedProfile = await adminMemberService.getProfile(id);
      setProfile(updatedProfile);
      if (updatedProfile.imageUrl) {
        setImagePreview(updatedProfile.imageUrl);
      }
      setImageBase64(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update member profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0c2c23]" />
        <span className="text-xs font-semibold">Loading profile editor...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Member profile not found</span>
          </div>
          <button
            onClick={() => navigate('/admin/members/active')}
            className="text-xs font-bold text-rose-700 underline"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-6 z-50 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'error'
              ? 'bg-rose-600'
              : 'bg-[#0c2c23] border border-emerald-500/30'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Content Header & Breadcrumbs (Matching Laravel style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-lg font-bold text-slate-800">Update Profile</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
            <Link to="/admin" className="hover:text-slate-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/admin/members/active" className="hover:text-slate-800 transition">
              Members
            </Link>
            <span>/</span>
            <Link to={`/admin/profile/${profile.id}`} className="hover:text-slate-800 transition">
              {profile.username}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Update</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/profile/${profile.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View Profile
          </Link>
        </div>
      </div>

      {/* Form & Widget Grid: Matches Laravel update_profile.blade.php */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form: col-12 col-lg-7 col-xl-8 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Member Information</h3>
                <p className="text-[11px] text-slate-500">
                  Update personal, contact, and settlement details for account {profile.username}.
                </p>
              </div>
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined: {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Details */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-700" /> Personal &amp; Contact Details
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="First Name"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Last Name"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Phone No */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.phone_no}
                      onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Residential Address */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Address"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State / Region"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" /> Choose New Photo
                      </button>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, or WEBP up to 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settlement & Banking Details Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" /> Settlement &amp; Bank Details
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      placeholder="e.g. Standard Chartered / Maybank"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Bank Branch */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Bank Branch
                    </label>
                    <input
                      type="text"
                      value={formData.bank_branch}
                      onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                      placeholder="Branch name or location"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Account No */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Account No.
                    </label>
                    <input
                      type="text"
                      value={formData.account_no}
                      onChange={(e) => setFormData({ ...formData, account_no: e.target.value })}
                      placeholder="Account number"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Account Holder Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Account Holder&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={formData.account_holder_name}
                      onChange={(e) =>
                        setFormData({ ...formData, account_holder_name: e.target.value })
                      }
                      placeholder="Full name as in bank records"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* Bank Code */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Bank Code / IFSC
                    </label>
                    <input
                      type="text"
                      value={formData.bank_code}
                      onChange={(e) => setFormData({ ...formData, bank_code: e.target.value })}
                      placeholder="SWIFT / IFSC / Bank code"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>

                  {/* NRIC Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      NRIC / Identity Number
                    </label>
                    <input
                      type="text"
                      value={formData.nric_number}
                      onChange={(e) => setFormData({ ...formData, nric_number: e.target.value })}
                      placeholder="NRIC or National ID"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <Link
                  to={`/admin/profile/${profile.id}`}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-2xs"
                >
                  {submitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{submitting ? 'Updating...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Member Overview Widget (col-12 col-lg-5 col-xl-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#0c2c23] via-[#144236] to-[#1c5546] p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                Summary
              </span>
              <h3 className="text-sm font-bold text-white truncate">{profile.name}</h3>
              <p className="text-[11px] text-white/80 font-mono">{profile.username}</p>
            </div>

            <div className="px-5 pb-5 pt-0 relative">
              <div className="w-16 h-16 -mt-8 rounded-full bg-white p-1 shadow-md border border-slate-200 mx-auto overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={profile.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Direct Referrals Counter */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {profile.directReferrals}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                  Direct Referrals
                </div>
              </div>

              {/* Details List */}
              <div className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                  </span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]">
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" /> User ID
                  </span>
                  <span className="font-mono font-bold text-slate-900">{profile.username}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone No.
                  </span>
                  <span className="font-semibold text-slate-800">{profile.phone || '-'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Country
                  </span>
                  <span className="font-semibold text-slate-800">{profile.countryName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" /> Rank
                  </span>
                  <span className="font-semibold text-emerald-700">{profile.rankName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Sponsor
                  </span>
                  <span className="font-medium text-slate-800">{profile.sponsorId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberUpdateProfilePage;
