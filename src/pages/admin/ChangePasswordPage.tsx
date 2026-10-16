import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  LogOut,
} from 'lucide-react';
import { adminSettingsService } from '../../services/adminSettingsService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const ChangePasswordPage: React.FC = () => {
  const { logout } = useAdminAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Password visibility toggles (matching Laravel blade .showpass script)
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & Validation
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    old_password?: string;
    password?: string;
    password_confirmation?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const errors: {
      old_password?: string;
      password?: string;
      password_confirmation?: string;
    } = {};

    if (!oldPassword.trim()) {
      errors.old_password = 'The old password field is required.';
    }

    if (!password) {
      errors.password = 'The new password field is required.';
    } else if (password.length < 6) {
      errors.password = 'The new password must be at least 6 characters.';
    }

    if (!passwordConfirmation) {
      errors.password_confirmation = 'The password confirmation field is required.';
    } else if (password !== passwordConfirmation) {
      errors.password_confirmation = 'New password & confirm password must be the same.';
    }

    if (oldPassword && password && oldPassword === password) {
      errors.password = 'New Password cannot be same as your current password. Please choose a different password.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg(errors.old_password || errors.password || errors.password_confirmation || 'Please check the form for errors.');
      return;
    }

    setFieldErrors({});

    try {
      setLoading(true);
      const res = await adminSettingsService.changePassword({
        old_password: oldPassword,
        password: password,
        confirm_password: passwordConfirmation,
      });

      setSuccessMsg(res.message || 'Password updated successfully');
      setOldPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Server busy, please try later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Content Header (Page header) matching manage/admin/change_password.blade.php */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/80">
        <h4 className="text-xl font-bold text-slate-800">Change Password</h4>
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
              Change Password
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content Box matching AdminLTE .box */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Box Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-base">Change Password</h4>
        </div>

        {/* Box Body */}
        <div className="p-6">
          {/* Dismissible Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start justify-between text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-red-600 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dismissible Success Alert */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-start justify-between text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-emerald-500 hover:text-emerald-700 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Centered Form matching col-sm-6 offset-3 */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Old Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (fieldErrors.old_password) setFieldErrors({ ...fieldErrors, old_password: undefined });
                  }}
                  placeholder="Enter old password"
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    fieldErrors.old_password ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-[#3c8dbc]'
                  } focus:ring-1 outline-none pr-11 transition`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                  title={showOldPass ? 'Hide password' : 'Show password'}
                >
                  {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.old_password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.old_password}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="Enter new password (min. 6 chars)"
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    fieldErrors.password ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-[#3c8dbc]'
                  } focus:ring-1 outline-none pr-11 transition`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                  title={showNewPass ? 'Hide password' : 'Show password'}
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    if (fieldErrors.password_confirmation) setFieldErrors({ ...fieldErrors, password_confirmation: undefined });
                  }}
                  placeholder="Repeat new password"
                  className={`w-full text-sm px-4 py-2.5 rounded-lg border ${
                    fieldErrors.password_confirmation ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:border-[#3c8dbc]'
                  } focus:ring-1 outline-none pr-11 transition`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                  title={showConfirmPass ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password_confirmation && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.password_confirmation}</p>
              )}
            </div>

            {/* Box Footer matching box-footer text-center */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-medium rounded-lg text-sm shadow transition disabled:opacity-50"
              >
                {loading ? (
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
      </div>

      {/* Logout Session Card directly below Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <LogOut className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-slate-800">Admin Session</h5>
            <p className="text-xs text-slate-500">
              Need to sign out of this session? Terminate current access and return to login.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout error:', err);
            } finally {
              window.location.href = '/backoffice';
            }
          }}
          className="px-5 py-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center gap-2 cursor-pointer shrink-0 border border-slate-200 hover:border-rose-200 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
