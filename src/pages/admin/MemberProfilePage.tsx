import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  adminMemberService,
  type MemberProfileData,
} from '../../services/adminMemberService';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Building2,
  CreditCard,
  ArrowLeft,
  Edit,
  UserCheck,
  Loader2,
  AlertCircle,
  ExternalLink,
  Users,
  Award,
} from 'lucide-react';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MemberProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminMemberService.getProfile(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Impersonate (Login as User in same window)
  const handleImpersonate = async () => {
    if (!profile) return;
    if (
      !window.confirm(
        `Are you sure you want to log in as user ${profile.username} (${profile.name})?\n\nAdmin session will be paused and the user portal will open in this window.`
      )
    ) {
      return;
    }

    setImpersonating(true);
    try {
      const res = await adminMemberService.impersonate(profile.id);
      if (res.token) {
        const adminToken = localStorage.getItem('admin_token');
        const adminUser = localStorage.getItem('admin_user');

        // Store impersonation snapshot
        if (adminToken) localStorage.setItem('impersonate_admin_token', adminToken);
        if (adminUser) localStorage.setItem('impersonate_admin_user', adminUser);
        localStorage.setItem(
          'impersonate_admin_return_url',
          `/admin/profile/${profile.id}`
        );

        // Clear active admin credentials
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_login_time');

        // Set user credentials
        localStorage.setItem('user_token', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('user_login_time', Date.now().toString());

        // Redirect in same window to user dashboard
        window.location.href = '/user/dashboard';
      }
    } catch (err: any) {
      alert(err.message || 'Failed to impersonate member');
      setImpersonating(false);
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
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0c2c23]" />
        <span className="text-xs font-semibold">Loading member profile...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error || 'Member not found'}</span>
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
      {/* Content Header & Breadcrumbs (Matching Laravel style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-lg font-bold text-slate-800">Profile</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
            <Link to="/admin" className="hover:text-slate-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/admin/members/active" className="hover:text-slate-800 transition">
              Members
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{profile.username}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/members/active"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Members
          </Link>
          <Link
            to={`/admin/update-profile/${profile.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c2c23] hover:bg-[#143d32] text-white text-xs font-semibold shadow-2xs transition"
          >
            <Edit className="w-3.5 h-3.5 text-emerald-400" /> Update Profile
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Widget + Right Details Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Member Card Widget (col-12 col-lg-5 col-xl-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {/* Widget Header with background pattern */}
            <div className="h-28 bg-gradient-to-r from-[#0c2c23] via-[#144236] to-[#1c5546] relative p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                Member Profile
              </span>
              <h3 className="text-base font-bold text-white truncate">{profile.name}</h3>
              <p className="text-xs text-white/80 font-mono">{profile.username}</p>
            </div>

            {/* Widget Avatar */}
            <div className="px-5 pt-0 pb-4 relative">
              <div className="w-20 h-20 -mt-10 rounded-full bg-white p-1 shadow-md border border-slate-200 mx-auto overflow-hidden">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.username}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Direct Referrals Counter (Matching Laravel description-block) */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {profile.directReferrals}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                  Direct Referrals
                </div>
              </div>

              {/* Quick Details List */}
              <div className="mt-4 space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                  </span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">
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
                    <Award className="w-3.5 h-3.5 text-slate-400" /> Rank / Package
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {profile.rankName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Sponsor
                  </span>
                  <span className="font-medium text-slate-800">
                    {profile.sponsorId} {profile.sponsorName !== '-' ? `(${profile.sponsorName})` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Wallet Balance
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    ${profile.walletBalance.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Status</span>
                  <div>
                    {profile.status === 'Active' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Inactive
                      </span>
                    )}
                    {profile.isBlocked && (
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                        Blocked
                      </span>
                    )}
                    {profile.isSuspended && (
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Login as User Impersonate Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleImpersonate}
                  disabled={impersonating}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0c2c23] border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  {impersonating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>Login as User (Impersonate)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Details & Bank / KYC (col-12 col-lg-7 col-xl-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
            {/* Header row with date */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">User Profile Audit</h3>
                <p className="text-[11px] text-slate-500">
                  Detailed registration, identity credentials, and banking breakdown.
                </p>
              </div>
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered: {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            {/* KYC & Identity Details Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>KYC &amp; Contact Details:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    NRIC / National ID
                  </span>
                  <span className="font-mono font-semibold text-slate-800">
                    {profile.nricNumber || 'Not submitted'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Country
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.countryName} {profile.countryIso ? `(${profile.countryIso})` : ''}
                  </span>
                </div>

                <div className="sm:col-span-2 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Residential Address
                  </span>
                  <span className="font-medium text-slate-800">
                    {profile.address || 'No residential address on file.'}
                    {profile.city && `, ${profile.city}`}
                    {profile.state && `, ${profile.state}`}
                  </span>
                </div>

                {profile.nricImage && (
                  <div className="sm:col-span-2 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-2">
                      NRIC / KYC Document Copy
                    </span>
                    <a
                      href={profile.nricImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block group relative rounded-lg border border-slate-200 overflow-hidden"
                    >
                      <img
                        src={profile.nricImage}
                        alt="NRIC KYC Copy"
                        className="w-40 h-40 object-cover group-hover:opacity-90 transition"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" /> View Full
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details Section (Matching Laravel bank details block) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Bank Account Details:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Bank Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {profile.bankName || '-'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Bank Branch
                  </span>
                  <span className="font-semibold text-slate-800">
                    {profile.bankBranch || '-'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Account No.
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {profile.accountNo || '-'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Account Holder&apos;s Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {profile.accountHolderName || '-'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Account Type
                  </span>
                  <span className="font-semibold text-slate-800">
                    {profile.accountType || '-'}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Bank Code / IFSC
                  </span>
                  <span className="font-mono font-semibold text-slate-800">
                    {profile.bankCode || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/admin/members/active"
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Back to Members
              </Link>
              <Link
                to={`/admin/update-profile/${profile.id}`}
                className="px-4 py-1.5 rounded-lg bg-[#0c2c23] hover:bg-[#143d32] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Profile Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
