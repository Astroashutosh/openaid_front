import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { LanguageSwitcher } from '../../../components/common/LanguageSwitcher';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Destination from location state if redirected
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your Admin UserId or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid UserId or Password');
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

      {/* Top Header */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.2)]">
            OAI
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block leading-tight">
              OpenAid <span className="text-[#D4A72C]">International</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#D4A72C] font-semibold uppercase block">
              Backoffice Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher theme="dark" align="end" />
          <Link
            to="/login"
            className="text-xs font-bold text-white/70 hover:text-white transition px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10"
          >
            Member Portal →
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-[950px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[30px] border border-[#D4A72C]/25 bg-[#03150D]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {/* Left Brand Panel */}
          <div className="relative hidden lg:flex flex-col justify-between min-h-[560px] p-10 xl:p-12 bg-gradient-to-br from-[#0B3B27] via-[#082A1B] to-[#03150D] overflow-hidden border-r border-[#D4A72C]/15">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4A72C]/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,167,44,0.18)]">
                <span className="text-[#D4A72C] font-black text-2xl tracking-wider">OAI</span>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A72C]/15 border border-[#D4A72C]/30 text-[#D4A72C] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Administrative Backoffice
              </div>

              <h2 className="mt-4 text-3xl xl:text-4xl font-black leading-tight text-white">
                Secure System <br />
                <span className="text-[#D4A72C]">Administration.</span>
              </h2>

              <p className="mt-4 max-w-sm text-white/60 text-sm leading-relaxed">
                Authorized access only. Monitor system nodes, financial packages, FIFO matching queues, and user compliance.
              </p>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/10 text-xs text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>End-to-End JWT Session Security</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>Brute-Force Rate Limiting Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>Automated Inactivity Protection</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#03150D]/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4A72C] mb-2">
                <ShieldAlert className="w-4 h-4" />
                Admin Authentication
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Enter your administrative credentials to manage the platform.
              </p>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-5" autoComplete="off">
                {/* Username / Email */}
                <div>
                  <label htmlFor="admin_username" className="block mb-2 text-sm font-semibold text-white/75">
                    Admin UserId / Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      id="admin_username"
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoFocus
                      placeholder="Enter admin username or email"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="admin_password" className="text-sm font-semibold text-white/75">
                      Password
                    </label>
                    <Link
                      to="/admin-reset"
                      className="text-xs text-[#D4A72C] hover:text-[#F2C14E] transition font-semibold"
                    >
                      Forget Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                    <input
                      id="admin_password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter admin password"
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black shadow-[0_0_30px_rgba(212,167,44,0.18)] hover:shadow-[0_0_40px_rgba(212,167,44,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-xs text-white/40">
              OpenAid International Backoffice • Protected Node
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-white/30 border-t border-white/5">
        © {new Date().getFullYear()} OpenAid International. All rights reserved.
      </footer>
    </div>
  );
};
