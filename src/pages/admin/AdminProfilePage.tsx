import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
} from 'lucide-react';
import {
  adminProfileService,
  type AdminProfileData,
  type CountryItem,
} from '../../services/adminProfileService';
import { buildAssetUrl } from '../../config/api';

export const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [fetching, setFetching] = useState(true);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [address, setAddress] = useState('');
  const [countryId, setCountryId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // Status & Feedback
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Helper to format user avatar URL
  const getAvatarUrl = (imgName?: string | null): string => {
    if (!imgName || imgName === 'default.png') {
      return 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
    }
    if (imgName.startsWith('http') || imgName.startsWith('data:')) {
      return imgName;
    }
    const clean = imgName.startsWith('/') ? imgName.slice(1) : imgName;
    if (clean.startsWith('uploads/')) {
      return buildAssetUrl(clean);
    }
    return buildAssetUrl(`uploads/user/${clean}`);
  };

  const fetchProfile = async () => {
    try {
      setFetching(true);
      setErrorMsg(null);
      const res = await adminProfileService.getProfile();
      if (res.data) {
        setProfile(res.data);
        setFirstName(res.data.first_name || '');
        setLastName(res.data.last_name || '');
        setEmail(res.data.email || '');
        setPhoneNo(res.data.phone_no || '');
        setAddress(res.data.address || '');
        setCountryId(res.data.country ? String(res.data.country) : '');
        if (res.data.image) {
          setImagePreview(getAvatarUrl(res.data.image));
        }
      }
      if (res.countries) {
        setCountries(res.countries);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load admin profile');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, JPG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size cannot exceed 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setImagePreview(dataUri);
      setBase64Image(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.first_name = 'First name is required.';
    if (!address.trim()) errors.address = 'Address is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please correct the highlighted errors before saving.');
      return;
    }

    setFieldErrors({});

    try {
      setUpdating(true);
      const res = await adminProfileService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_no: phoneNo,
        address: address,
        country: countryId,
        image: base64Image || undefined,
      });

      setSuccessMsg(res.message || 'Profile updated successfully');
      if (res.data) {
        setProfile(res.data);
        if (res.data.image) {
          setImagePreview(getAvatarUrl(res.data.image));
        }
      }
      setBase64Image(null);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const currentCountryName = countries.find((c) => String(c.id) === String(countryId))?.name || 'Not set';

  const formattedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc] mb-3" />
        <p className="text-sm font-medium">Loading Admin Profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Content Header (Page header) matching manage/admin/users/update_admin_profile.blade.php */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/80">
        <h4 className="text-xl font-bold text-slate-800">Update Profile</h4>
        <nav aria-label="breadcrumb">
          <ol className="flex items-center space-x-2 text-xs text-slate-500">
            <li>
              <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-400 font-medium" aria-current="page">
              Profile
            </li>
          </ol>
        </nav>
      </div>

      {/* Dismissible Feedback Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start justify-between text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600 ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start justify-between text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two Column Layout matching col-12 col-lg-7 col-xl-8 (Left) & col-12 col-lg-5 col-xl-4 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Section */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-base">User Profile</h2>
            {formattedDate && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined: {formattedDate}</span>
              </span>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (fieldErrors.first_name) setFieldErrors({ ...fieldErrors, first_name: '' });
                  }}
                  placeholder="First Name"
                  className={`w-full text-sm px-3.5 py-2.5 rounded-lg border ${
                    fieldErrors.first_name ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-[#3c8dbc]'
                  } focus:ring-1 outline-none transition`}
                />
                {fieldErrors.first_name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#3c8dbc] focus:ring-1 outline-none transition"
                />
              </div>

              {/* Email (Readonly matching backoffice standards) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400">Master account email</span>
              </div>

              {/* Phone No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone No.
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#3c8dbc] focus:ring-1 outline-none transition"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: '' });
                  }}
                  placeholder="Street / Office Address"
                  className={`w-full text-sm px-3.5 py-2.5 rounded-lg border ${
                    fieldErrors.address ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-[#3c8dbc]'
                  } focus:ring-1 outline-none transition`}
                />
                {fieldErrors.address && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.address}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <select
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#3c8dbc] focus:ring-1 outline-none bg-white transition"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Photo Uploader */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Profile Photo
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
                      }}
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold cursor-pointer transition shadow-sm inline-flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Choose New Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Recommended: Square format JPG/PNG up to 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
              <button
                type="submit"
                disabled={updating}
                className="px-8 py-2.5 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AdminLTE widget-user Profile Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Banner */}
            <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 p-4 text-white relative">
              <h3 className="font-bold text-base truncate">
                {firstName ? `${firstName} ${lastName}`.trim() : 'Master Admin'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">@{profile?.username || 'admin'}</p>
            </div>

            {/* Avatar overlapping banner */}
            <div className="px-6 relative -mt-12 flex justify-start">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img
                  src={imagePreview || getAvatarUrl(profile?.image)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=128';
                  }}
                />
              </div>
            </div>

            {/* Profile Info Details List */}
            <div className="p-6 pt-3 space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-600 pb-2.5 border-b border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-400 block text-[11px] uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-slate-800 truncate block">{email || '-'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 pb-2.5 border-b border-slate-100">
                <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-400 block text-[11px] uppercase tracking-wider">UserId</span>
                  <span className="font-semibold text-slate-800">{profile?.username || 'admin'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 pb-2.5 border-b border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-400 block text-[11px] uppercase tracking-wider">Phone No.</span>
                  <span className="font-semibold text-slate-800">{phoneNo || '-'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 pb-2.5 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-400 block text-[11px] uppercase tracking-wider">Address</span>
                  <span className="font-semibold text-slate-800 block truncate">{address || '-'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-400 block text-[11px] uppercase tracking-wider">Country</span>
                  <span className="font-semibold text-slate-800">{currentCountryName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
