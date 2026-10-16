import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { adminAuthService } from '../../../services/adminAuthService';

export const AdminResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      setTokenValid(false);
      setErrorMessage('Reset token is missing.');
      return;
    }

    const checkToken = async () => {
      try {
        const res = await adminAuthService.verifyResetToken(token);
        setTokenValid(true);
        if (res.email) setAccountEmail(res.email);
      } catch (err: any) {
        setTokenValid(false);
        setErrorMessage(err.message || 'Password reset token has expired or is invalid.');
      } finally {
        setIsValidating(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminAuthService.resetPassword(token || '', password, passwordConfirmation);
      setSuccessMessage(res.message || 'Your password has been changed successfully!');
      setTimeout(() => {
        navigate('/backoffice', { replace: true });
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03150D] text-white flex flex-col justify-between font-sans selection:bg-[#D4A72C] selection:text-black">
      {/* Background radial gradients & grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_32%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#D4A72C]/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.2)]">
            OAI
          </div>
          <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">
            OpenAid <span className="text-[#D4A72C]">International</span>
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-[500px] overflow-hidden rounded-[30px] border border-[#D4A72C]/25 bg-[#03150D]/95 p-8 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.12)]">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="mt-6 text-3xl font-black text-white tracking-tight">
            Set New Password
          </h1>

          {accountEmail && (
            <p className="mt-2 text-xs text-slate-300">
              Resetting credentials for: <span className="text-[#D4A72C] font-semibold">{accountEmail}</span>
            </p>
          )}

          {isValidating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-3 border-[#D4A72C] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-sm text-white/60">Verifying secure token...</p>
            </div>
          ) : !tokenValid ? (
            <div className="mt-6">
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Token Expired or Invalid</div>
                  <div className="mt-1 text-xs text-red-200/70">{errorMessage}</div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/admin-reset"
                  className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center transition"
                >
                  Request a New Link
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-5 rounded-2xl border border-[#D4A72C]/40 bg-[#D4A72C]/10 px-4 py-3 text-sm text-[#F2C14E] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#D4A72C]" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" autoComplete="off">
                {/* New Password */}
                <div>
                  <label htmlFor="new_password" className="block mb-2 text-sm font-semibold text-white/75">
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      id="new_password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter new password"
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm_password" className="block mb-2 text-sm font-semibold text-white/75">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      placeholder="Re-enter new password"
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black shadow-[0_0_30px_rgba(212,167,44,0.18)] hover:shadow-[0_0_40px_rgba(212,167,44,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-xs text-white/40">
            <Link to="/backoffice" className="text-[#D4A72C] hover:underline font-semibold">
              Return to Admin Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center text-xs text-white/30 border-t border-white/5">
        © {new Date().getFullYear()} OpenAid International. All rights reserved.
      </footer>
    </div>
  );
};
