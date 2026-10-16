import React, { useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  RefreshCw,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Ticket,
  ShoppingBag
} from 'lucide-react';

interface CompletedCycleLog {
  id: number | string;
  packageName: string;
  packagePrice: number;
  pinCost: number;
  earnedAmount: number;
  surplus: number;
}

const SAMPLE_CYCLES: Record<string, CompletedCycleLog> = {
  '104': {
    id: 104,
    packageName: 'Starter Support Package',
    packagePrice: 100,
    pinCost: 10,
    earnedAmount: 162,
    surplus: 62
  },
  '101': {
    id: 101,
    packageName: 'Community Micro Seed',
    packagePrice: 50,
    pinCost: 5,
    earnedAmount: 81,
    surplus: 31
  },
  '108': {
    id: 108,
    packageName: 'Growth Builder Tier',
    packagePrice: 250,
    pinCost: 25,
    earnedAmount: 405,
    surplus: 155
  }
};

export const UserRecommitOverviewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const cycleId = id || searchParams.get('cycle_id') || '104';
  const cycle = SAMPLE_CYCLES[cycleId] || SAMPLE_CYCLES['104'];

  // Mock wallet balances
  const redonationBalance = 240.0;
  const [availablePinsCount] = useState<number>(2); // User has 2 credits

  const [txPassword, setTxPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasRedonationBalance = redonationBalance >= cycle.packagePrice;
  const diffRedonation = cycle.packagePrice - redonationBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!hasRedonationBalance) {
      setErrorMessage(
        `Insufficient Redonation Wallet balance. You are short $${diffRedonation.toFixed(2)}.`
      );
      return;
    }

    if (availablePinsCount <= 0) {
      setErrorMessage(`You need at least 1 active $${cycle.pinCost.toFixed(2)} Credit to recommit.`);
      return;
    }

    if (!txPassword.trim()) {
      setErrorMessage('Please enter your transaction password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        `Recommitment of $${cycle.packagePrice.toFixed(
          2
        )} confirmed! A fresh FIFO position was queued, and +$${cycle.surplus.toFixed(
          2
        )} surplus was unlocked into your Withdrawable Wallet!`
      );
      setTxPassword('');
      setTimeout(() => {
        navigate('/user/recommitment');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Header matching recommit_overview.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <nav aria-label="breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link to="/user/dashboard" className="hover:text-emerald-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/user/make-donation" className="hover:text-emerald-700">
                  Donations
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/user/recommitment" className="hover:text-emerald-700">
                  Recommitment
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-900 font-bold" aria-current="page">
                Overview &amp; Confirmation
              </li>
            </ol>
          </nav>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E2718]">
            Recommitment Overview &amp; Confirmation
          </h2>
        </div>
        <Link
          to="/user/recommitment"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Recommitments
        </Link>
      </div>

      {/* Steps Indicator matching Blade */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="grid grid-cols-3 text-center text-xs font-bold gap-2">
          {/* Step 1 */}
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs shadow-xs">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="hidden sm:inline">1. Cycle Completed (162%)</span>
          </div>

          {/* Step 2 (Active Orange) */}
          <div className="flex items-center justify-center gap-2 text-[#ff7a1a]">
            <span className="w-7 h-7 rounded-full bg-[#ff7a1a] text-white inline-flex items-center justify-center text-xs shadow-xs">
              2
            </span>
            <span>2. Recommit &amp; Unlock</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-400 inline-flex items-center justify-center text-xs">
              3
            </span>
            <span className="hidden sm:inline">3. Surplus Released</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1 font-semibold">{errorMessage}</div>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-semibold">{successMessage}</div>
        </div>
      )}

      {/* 2-Column Overview Grid matching Blade */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Completed Cycle & Recommitment Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Cycle #{cycle.id}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Completed (162%)
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-xl mt-4 mb-1">
                {cycle.packageName} Recommitment
              </h3>
              <div className="text-4xl font-black text-[#ff7a1a] my-2">
                ${cycle.packagePrice.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Recommit capital to unlock ${cycle.surplus.toFixed(2)} surplus into Withdrawable
                Wallet.
              </p>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Highlight Box matching Blade #FAF8F5 */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ff7a1a]/20 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Earned Return (162%):</span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${cycle.earnedAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Recommit Capital:</span>
                  <strong className="text-slate-900">${cycle.packagePrice.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#ff7a1a]/15">
                  <span className="text-slate-600">Surplus Unlocked:</span>
                  <strong className="text-base font-black text-emerald-700">
                    +${cycle.surplus.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Recommitment Rules */}
              <div>
                <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                  Recommitment Rules:
                </h6>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Recommitment is funded strictly using your <strong>Redonation Wallet</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Requires <strong>1x ${cycle.pinCost.toFixed(2)} Credit</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Surplus (+${cycle.surplus.toFixed(2)}) immediately transfers to Withdrawable
                      Wallet.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Creates a brand new FIFO Queue position to earn another 162% cycle.</span>
                  </li>
                </ul>
              </div>

              {/* Credit Status Box matching Blade */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-amber-500" /> Package Credit Status:
                    </span>
                    <small className="text-slate-500">1x ${cycle.pinCost.toFixed(2)} Credit required</small>
                  </div>
                  <div>
                    {availablePinsCount > 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> {availablePinsCount} Ready
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        0 Available
                      </span>
                    )}
                  </div>
                </div>

                {availablePinsCount === 0 && (
                  <div className="pt-2 border-t border-slate-200/80 text-right">
                    <Link
                      to={`/user/buy-epins/overview?quantity=1`}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold inline-flex items-center gap-1 text-[11px]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy ${cycle.pinCost.toFixed(2)} Credit Now →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
              <Link
                to="/user/recommitment"
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Recommitment Protocol
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment via Redonation Wallet (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-100">
              <h5 className="font-black text-slate-900 text-base mb-1">
                Confirm Recommitment Funding
              </h5>
              <p className="text-xs text-slate-500">
                Recommit ${cycle.packagePrice.toFixed(2)} using your Redonation Wallet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Redonation Wallet Selection Card matching Blade */}
              <div className="rounded-2xl border-2 border-[#ff7a1a] bg-[#ff7a1a]/[0.04] p-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#ff7a1a]/15 text-[#ff7a1a] flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h6 className="font-bold text-slate-900 text-base">Redonation Wallet</h6>
                        <small className="text-slate-500 text-xs">
                          Funds reserved from completed donation cycle returns
                        </small>
                      </div>

                      <div>
                        {hasRedonationBalance ? (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Balance: $
                            {redonationBalance.toFixed(2)}
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Balance: ${redonationBalance.toFixed(2)} (Short $
                            {diffRedonation.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Debit / Surplus Breakdown */}
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Available Redonation Balance:</span>
                        <strong className="text-slate-900">${redonationBalance.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Recommit Debit:</span>
                        <strong className="text-rose-600">-${cycle.packagePrice.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold">
                        <span className="text-slate-900">
                          Surplus Released to Withdrawable Wallet:
                        </span>
                        <strong className="text-sm font-black text-emerald-600">
                          +${cycle.surplus.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Password Field */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Transaction Password <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="password"
                  value={txPassword}
                  onChange={(e) => setTxPassword(e.target.value)}
                  placeholder="Enter your transaction password"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* SUBMIT BUTTON */}
              {!hasRedonationBalance ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-500 text-sm bg-slate-200 cursor-not-allowed"
                >
                  Insufficient Redonation Wallet Balance
                </button>
              ) : availablePinsCount === 0 ? (
                <Link
                  to={`/user/buy-epins/overview?quantity=1`}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 text-sm bg-amber-400 hover:bg-amber-500 transition shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Buy ${cycle.pinCost.toFixed(2)} Credit First
                </Link>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm bg-[#ff7a1a] hover:bg-[#ea6b14] disabled:opacity-50 transition shadow-md shadow-[#ff7a1a]/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing Recommitment...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" /> Recommit ${cycle.packagePrice.toFixed(2)}{' '}
                      from Redonation Wallet &amp; Unlock ${cycle.surplus.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
