import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Key,
  ShieldCheck,
  Check,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

type ResetTabType = 'login' | 'tx';

export const ForgotPasswordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResetTabType>('login');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === 'login') {
        setSuccessMessage(
          `We have e-mailed your login password reset link to ${email}. Please check your inbox and spam folder.`
        );
      } else {
        setSuccessMessage(
          `We have e-mailed your transaction password reset link to ${email}. Please check your inbox and spam folder.`
        );
      }
    }, 900);
  };

  const handleTabSwitch = (tab: ResetTabType) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03150D] text-white flex flex-col justify-between">
      {/* Background radial gradients & grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_32%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#D4A72C]/10 blur-[120px] pointer-events-none" />

      {/* Top Header Bar with Language Switcher */}
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
            to="/login"
            className="text-xs font-bold text-[#D4A72C] hover:text-[#F2C14E] transition px-3 py-1.5 rounded-lg border border-[#D4A72C]/30 hover:bg-[#D4A72C]/10"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Card (Replicating auth/passwords/email.blade.php max-w-[1050px] split card) */}
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

              <p className="mt-6 max-w-md text-white/55 text-sm leading-relaxed">
                Secure access to your OpenAid account. Reset your password and continue your journey with our decentralized ecosystem.
              </p>
            </div>

            {/* Feature Pillars matching blade */}
            <div className="relative z-10 space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C]">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-white/70 text-sm font-medium">Secure account recovery</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C]">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-white/70 text-sm font-medium">Protected member account</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C]">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-white/70 text-sm font-medium">Smart contract powered ecosystem</span>
              </div>
            </div>
          </div>

          {/* Right Reset Form Panel */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#03150D]/90 flex flex-col justify-between">
            <div>
              {/* Back to Login link */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-[#D4A72C] transition mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              {/* Title & Icon */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.12)]">
                  <Mail className="w-6 h-6" />
                </div>

                <h1 className="mt-6 text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Forgot Password?
                </h1>

                <p className="mt-3 text-white/50 text-sm leading-relaxed">
                  No worries. Enter your registered email address and we'll help you reset your password.
                </p>
              </div>

              {/* Reset Type Selector (Login Password vs Transaction Password) */}
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === 'login'
                        ? 'bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black shadow-[0_0_24px_rgba(212,167,44,0.3)]'
                        : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    Login Password
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSwitch('tx')}
                    className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === 'tx'
                        ? 'bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black shadow-[0_0_24px_rgba(212,167,44,0.3)]'
                        : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Transaction Password
                  </button>
                </div>

                <p className="mt-3 text-xs text-white/45 leading-relaxed">
                  {activeTab === 'login'
                    ? "Enter your registered email address and we'll help you reset your login password."
                    : "Enter your registered email address and we'll send you a link to reset your transaction password."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="rounded-2xl border border-[#D4A72C]/40 bg-[#D4A72C]/10 px-4 py-3.5 text-sm text-[#F2C14E] flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-[#D4A72C] mt-0.5" />
                    <span className="leading-relaxed">{successMessage}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-white/70">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black shadow-[0_0_30px_rgba(212,167,44,0.18)] hover:shadow-[0_0_40px_rgba(212,167,44,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <span>
                      {activeTab === 'login' ? 'Send Login Reset Link' : 'Send Transaction Reset Link'}
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Register Prompt */}
            <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-sm text-white/40">
              Don't have an account?{' '}
              <Link to="/register" className="ml-1 text-[#D4A72C] font-bold hover:text-[#F2C14E] transition">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-white/30 border-t border-white/5">
        &copy; {new Date().getFullYear()} OpenAid International. All rights reserved.
      </footer>
    </div>
  );
};
