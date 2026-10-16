import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { useUserAuth } from '../../context/UserAuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUserAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your User ID or Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/user/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid UserId or Password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03150D] text-white flex flex-col justify-between">
      {/* Background radial gradients & grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_32%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#D4A72C]/10 blur-[120px] pointer-events-none" />

      {/* Top Header bar with Language Switcher */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4A72C]/40 flex items-center justify-center font-black text-sm text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.2)]">
            OAI
          </div>
          <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">
            OpenAid <span className="text-[#D4A72C]">International</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher theme="dark" align="end" />
          <Link
            to="/register"
            className="text-xs font-bold text-[#D4A72C] hover:text-[#F2C14E] transition px-3 py-1.5 rounded-lg border border-[#D4A72C]/30 hover:bg-[#D4A72C]/10"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Card (Matching login.blade.php max-w-[1050px] split card) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-[1050px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[30px] border border-[#D4A72C]/25 bg-[#03150D]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          {/* Left Brand Panel */}
          <div className="relative hidden lg:flex flex-col justify-between min-h-[620px] p-10 xl:p-12 bg-gradient-to-br from-[#0B3B27] via-[#082A1B] to-[#03150D] overflow-hidden border-r border-[#D4A72C]/15">
            {/* Glowing Orbs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#D4A72C]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4A72C]/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,167,44,0.18)]">
                <span className="text-[#D4A72C] font-black text-2xl tracking-wider">OAI</span>
              </div>

              <h2 className="mt-8 text-4xl xl:text-5xl font-black leading-tight text-white">
                Build The Future <br />
                <span className="text-[#D4A72C]">Together.</span>
              </h2>

              <p className="mt-5 max-w-md text-white/60 text-sm leading-relaxed">
                Welcome to OpenAid International. Access your decentralized peer-to-peer ecosystem through your secure member portal.
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div className="relative z-10 space-y-3.5 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/25 flex items-center justify-center text-[#D4A72C]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-white/80 text-xs font-semibold">Decentralized P2P Ecosystem</span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/25 flex items-center justify-center text-[#D4A72C]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-white/80 text-xs font-semibold">2:1 Automated FIFO Matching</span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/25 flex items-center justify-center text-[#D4A72C]">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-white/80 text-xs font-semibold">100% Transparent On-Chain Settlement</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-6 sm:p-10 md:p-12 bg-[#03150D]/90 flex flex-col justify-center">
            {/* Mobile Brand */}
            <div className="flex lg:hidden items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-black border border-[#D4A72C]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,167,44,0.15)]">
                <span className="text-[#D4A72C] text-lg font-black">OAI</span>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome Back</h1>
              <p className="mt-1.5 text-white/50 text-xs sm:text-sm">
                Login to your OpenAid member account.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* User ID */}
              <div>
                <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-white/70">
                  User ID / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your User ID (e.g. OAI798249)"
                    required
                    className="w-full h-13 min-h-[52px] pl-11 pr-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[#D4A72C]/70 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                  />
                  <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#D4A72C] hover:text-[#F2C14E] font-semibold transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full h-13 min-h-[52px] pl-11 pr-12 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[#D4A72C]/70 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                  />
                  <Lock className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2.5 text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded accent-[#D4A72C] w-4 h-4"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 min-h-[52px] rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(212,167,44,0.22)] hover:shadow-[0_0_40px_rgba(212,167,44,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Login to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Switcher */}
            <div className="mt-8 text-center text-xs text-white/45">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#D4A72C] font-bold hover:text-[#F2C14E] transition ml-1"
              >
                Create Account →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-xs text-white/35 border-t border-white/5">
        © {new Date().getFullYear()} OpenAid International. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
