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
import { userAuthService } from '../../services/userAuthService';

export const UserResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsTokenValid(false);
        setErrorMessage('Password reset token is missing.');
        return;
      }

      try {
        const res = await userAuthService.verifyResetToken(token);
        if (res.success) {
          setIsTokenValid(true);
          setUserEmail(res.email || '');
          setUsername(res.username || '');
        } else {
          setIsTokenValid(false);
          setErrorMessage('Invalid or expired password reset link.');
        }
      } catch (err: any) {
        setIsTokenValid(false);
        setErrorMessage(err.message || 'Invalid or expired password reset link.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!token) {
      setErrorMessage('Reset token is missing.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await userAuthService.resetPassword({
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccessMessage(res.message || 'Password changed successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03150D] text-white flex flex-col justify-between font-sans selection:bg-[#D4A72C] selection:text-black">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_32%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />

      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.2)]">
            OAI
          </div>
          <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">
            OpenAid <span className="text-[#D4A72C]">International</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-[500px] p-8 sm:p-10 rounded-[30px] border border-[#D4A72C]/25 bg-[#03150D]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {isVerifying ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-3 border-[#D4A72C] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-sm text-[#D4A72C] font-semibold tracking-wider uppercase">
                Verifying Reset Token...
              </p>
            </div>
          ) : !isTokenValid ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
              <p className="text-sm text-white/60">
                {errorMessage || 'This password reset link is invalid or has already expired.'}
              </p>
              <div className="pt-4">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-bold text-sm shadow-lg hover:shadow-xl transition"
                >
                  Request New Reset Link
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Set New Password
                </h1>
                <p className="mt-2 text-white/50 text-xs">
                  Create a strong new password for your account.
                </p>
                {userEmail && (
                  <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-black/40 border border-[#D4A72C]/20 text-[#F2C14E] text-xs font-mono">
                    {username ? `${username} (${userEmail})` : userEmail}
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-6 rounded-2xl border border-[#D4A72C]/40 bg-[#D4A72C]/10 px-4 py-3.5 text-sm text-[#F2C14E] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#D4A72C]" />
                  <span>{successMessage} Redirecting to login...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5" autoComplete="off">
                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="At least 6 characters"
                      className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      placeholder="Re-enter password"
                      className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black uppercase tracking-wider shadow-[0_0_30px_rgba(212,167,44,0.18)] hover:shadow-[0_0_40px_rgba(212,167,44,0.32)] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-xs text-white/40">
            <Link to="/login" className="text-[#D4A72C] hover:underline font-semibold">
              Return to Member Sign In
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

export default UserResetPasswordPage;
