import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check
} from 'lucide-react';
import { adminAuthService } from '../../../services/adminAuthService';
import { LanguageSwitcher } from '../../../components/common/LanguageSwitcher';

export const AdminForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered administrator email address.');
      return;
    }

    setIsLoading(true);
    try {
      await adminAuthService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request password reset.');
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
              Backoffice Recovery
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher theme="dark" align="end" />
          <Link
            to="/backoffice"
            className="text-xs font-bold text-[#D4A72C] hover:text-[#F2C14E] transition px-3 py-1.5 rounded-lg border border-[#D4A72C]/30 hover:bg-[#D4A72C]/10"
          >
            Admin Sign In
          </Link>
        </div>
      </header>

      {/* Main Content Card (Matching adminemail.blade.php max-w-[950px] layout) */}
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

              <h2 className="mt-8 text-3xl xl:text-4xl font-black leading-tight text-white">
                Admin Credential <br />
                <span className="text-[#D4A72C]">Recovery.</span>
              </h2>

              <p className="mt-4 max-w-sm text-white/60 text-sm leading-relaxed">
                Secure recovery procedure for verified OpenAid platform administrators.
              </p>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/10 text-xs text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>Encrypted One-Time Recovery Tokens</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>Strict 30-Minute Invalidation Window</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/15 text-[#D4A72C] flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 text-[#D4A72C]" />
                </div>
                <span>Full Audit Logging of Security Events</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#03150D]/90 flex flex-col justify-between">
            <div>
              <Link
                to="/backoffice"
                className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-[#D4A72C] transition mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Login
              </Link>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.12)]">
                  <Mail className="w-6 h-6" />
                </div>

                <h1 className="mt-6 text-3xl font-black text-white tracking-tight">
                  Forgot Password?
                </h1>

                <p className="mt-2 text-white/50 text-sm leading-relaxed">
                  Enter your registered administrator email address and we'll help you reset your password.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="mt-6 space-y-6">
                  <div className="p-6 sm:p-7 rounded-2xl border border-[#D4A72C]/30 bg-[#D4A72C]/10 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center text-[#D4A72C]">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Reset Link Sent to Email</h3>
                      <p className="mt-2 text-sm text-white/75 leading-relaxed">
                        We have dispatched a secure password reset link to:
                      </p>
                      <div className="mt-2 inline-block px-3.5 py-1.5 rounded-lg bg-black/40 border border-[#D4A72C]/30 text-[#F2C14E] font-semibold text-sm">
                        {email}
                      </div>
                      <p className="mt-3 text-xs text-white/50 leading-relaxed">
                        Please check your inbox (and your Spam or Junk folder). Follow the link provided in the email to set a new password. The link will remain active for 60 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/backoffice"
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,167,44,0.18)] hover:shadow-[0_0_40px_rgba(212,167,44,0.32)] hover:-translate-y-0.5 transition"
                    >
                      <span>Return to Admin Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full text-center text-xs text-white/50 hover:text-[#D4A72C] py-2 transition cursor-pointer"
                    >
                      Didn't receive the email? Click here to try again
                    </button>
                  </div>
                </div>
              ) : (
                /* Input Form */
                <form onSubmit={handleSubmit} className="mt-6 space-y-5" autoComplete="off">
                  <div>
                    <label htmlFor="admin_email" className="block mb-2 text-sm font-semibold text-white/75">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35 pointer-events-none" />
                      <input
                        id="admin_email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                        placeholder="Enter admin email (e.g. admin@gmail.com)"
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 outline-none focus:border-[#D4A72C]/60 focus:ring-2 focus:ring-[#D4A72C]/15 transition"
                      />
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
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link to Email</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-xs text-white/40">
              OpenAid International Backoffice • Security Department
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
