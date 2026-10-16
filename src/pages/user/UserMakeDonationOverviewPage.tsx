import React, { useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Building2,
  Wallet,
  Lock,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

interface DonationPackage {
  id: number | string;
  title: string;
  price: number;
  pinCost: number;
  dailyLimit?: number;
}

const PACKAGES: DonationPackage[] = [
  { id: 1, title: 'Community Micro Seed', price: 50, pinCost: 5, dailyLimit: 5 },
  { id: 2, title: 'Starter Support Package', price: 100, pinCost: 10, dailyLimit: 5 },
  { id: 3, title: 'Growth Builder Tier', price: 250, pinCost: 25, dailyLimit: 3 },
  { id: 4, title: 'Community Pillar Tier', price: 500, pinCost: 50, dailyLimit: 3 },
  { id: 5, title: 'Global Ambassador Tier', price: 1000, pinCost: 100, dailyLimit: 2 },
  { id: 6, title: 'Ecosystem Crown Tier', price: 2500, pinCost: 250, dailyLimit: 1 },
];

export const UserMakeDonationOverviewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryPack = searchParams.get('package');
  const selectedPkg =
    PACKAGES.find((p) => String(p.id) === String(id) || String(p.id) === String(queryPack)) ||
    PACKAGES[1]; // default $100 Starter Support Package

  const targetPayout = selectedPkg.price * 1.62;
  const surplus = targetPayout - selectedPkg.price;

  // Mock available credits for this tier
  const [availablePinsCount] = useState<number>(2); // User has 2 credits available
  const donationsToday = 1;
  const isDailyLimitReached = (selectedPkg.dailyLimit ?? 0) > 0 && donationsToday >= (selectedPkg.dailyLimit ?? 0);

  // Mock balances
  const depositBalance = 350.0;
  const mainBalance = 425.5;

  const [paymentMethod, setPaymentMethod] = useState<'deposit_wallet' | 'balance'>('deposit_wallet');
  const [txPassword, setTxPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedWalletBalance = paymentMethod === 'deposit_wallet' ? depositBalance : mainBalance;
  const hasBalance = selectedWalletBalance >= selectedPkg.price;
  const diffBal = selectedPkg.price - selectedWalletBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isDailyLimitReached) {
      setErrorMessage('Daily donation quota reached for this package tier.');
      return;
    }

    if (availablePinsCount <= 0) {
      setErrorMessage(`You need 1x $${selectedPkg.pinCost.toFixed(2)} Credit to place this donation.`);
      return;
    }

    if (!hasBalance) {
      setErrorMessage(
        `Insufficient balance in ${
          paymentMethod === 'deposit_wallet' ? 'Donate Wallet' : 'Main Balance'
        }. You are short $${diffBal.toFixed(2)}.`
      );
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
        `Donation of $${selectedPkg.price.toFixed(
          2
        )} successfully confirmed! Position placed in 2:1 FIFO queue. Consumed 1x $${selectedPkg.pinCost.toFixed(
          2
        )} Credit.`
      );
      setTxPassword('');
      setTimeout(() => {
        navigate('/user/live-queue-tracker');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Header matching donations/overview.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <nav aria-label="breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link to="/user/dashboard" className="hover:text-emerald-700">
                  Dashboard
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/user/make-donation" className="hover:text-emerald-700">
                  Make Donation
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-900 font-bold" aria-current="page">
                Overview &amp; Checkout
              </li>
            </ol>
          </nav>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E2718]">
            Donation Overview &amp; Payment
          </h2>
        </div>
        <Link
          to="/user/make-donation"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Package
        </Link>
      </div>

      {/* Steps Indicator matching donations/overview.blade.php */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="grid grid-cols-3 text-center text-xs font-bold gap-2">
          {/* Step 1 */}
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-xs shadow-xs">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="hidden sm:inline">1. Select Package</span>
          </div>

          {/* Step 2 (Active Orange) */}
          <div className="flex items-center justify-center gap-2 text-[#ff7a1a]">
            <span className="w-7 h-7 rounded-full bg-[#ff7a1a] text-white inline-flex items-center justify-center text-xs shadow-xs">
              2
            </span>
            <span>2. Select Wallet &amp; Pay</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-400 inline-flex items-center justify-center text-xs">
              3
            </span>
            <span className="hidden sm:inline">3. Entered FIFO Queue</span>
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
        {/* LEFT COLUMN: Donation Package Overview & Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Selected Donation
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-emerald-600" />
                  162% Return
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-xl mt-4 mb-1">
                {selectedPkg.title}
              </h3>
              <div className="text-4xl font-black text-[#ff7a1a] my-2">
                ${selectedPkg.price.toFixed(2)}
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Expected Return Banner matching Blade #FAF8F5 */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ff7a1a]/20 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Expected Payout (162%):</span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${targetPayout.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Required Credit:</span>
                  <strong className="text-slate-900">
                    1x Credit (${selectedPkg.pinCost.toFixed(2)})
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Your Available Credit:</span>
                  {availablePinsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> {availablePinsCount} Ready
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                      0 Available
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Daily Donation Limit:</span>
                  {(selectedPkg.dailyLimit ?? 0) > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        isDailyLimitReached
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {donationsToday} / {selectedPkg.dailyLimit} used today
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Unlimited (Free)
                    </span>
                  )}
                </div>
              </div>

              {/* Credit Alert if 0 Available */}
              {availablePinsCount === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                  <span>
                    <strong>Credit Required:</strong> You need a ${selectedPkg.pinCost.toFixed(2)}{' '}
                    Credit for {selectedPkg.title}.
                  </span>
                  <Link
                    to={`/user/buy-epins/overview/${selectedPkg.id}?quantity=1`}
                    className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold shrink-0 text-[11px]"
                  >
                    Buy Credit
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  1x ${selectedPkg.pinCost.toFixed(2)} Credit will be automatically consumed when
                  this donation is placed.
                </div>
              )}

              {/* Protocol Highlights */}
              <div>
                <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                  Helping Protocol Highlights:
                </h6>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>2:1 Sequential FIFO Queue placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Receive 2 payments of 81% = 162% (${targetPayout.toFixed(2)})</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Level Commission distributed across 8 sponsor levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Recommit package to unlock withdrawable surplus (${surplus.toFixed(2)})
                    </span>
                  </li>
                </ul>
              </div>

              {/* Order Price Breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Donation Amount:</span>
                  <span>${selectedPkg.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Credit Activation:</span>
                  <span>1x ${selectedPkg.pinCost.toFixed(2)} Pin (Consumed)</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 text-sm font-black text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-lg text-[#ff7a1a]">${selectedPkg.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
              <Link
                to="/user/make-donation"
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Choose a different donation package
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Options (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-100">
              <h5 className="font-black text-slate-900 text-base mb-1">Select Payment Method</h5>
              <p className="text-xs text-slate-500">
                Choose how you wish to pay ${selectedPkg.price.toFixed(2)} for your{' '}
                {selectedPkg.title}.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Option 1: Donate Wallet */}
              <div
                onClick={() => setPaymentMethod('deposit_wallet')}
                className={`rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                  paymentMethod === 'deposit_wallet'
                    ? 'border-[#ff7a1a] bg-[#ff7a1a]/[0.03]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="payment_opt"
                    checked={paymentMethod === 'deposit_wallet'}
                    onChange={() => setPaymentMethod('deposit_wallet')}
                    className="mt-1 accent-[#ff7a1a]"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <label className="font-bold text-slate-900 text-sm block cursor-pointer">
                            Donate Wallet
                          </label>
                          <small className="text-slate-500 text-xs">
                            Pay using funds deposited via Blockchain
                          </small>
                        </div>
                      </div>

                      <div>
                        {depositBalance >= selectedPkg.price ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Balance: ${depositBalance.toFixed(2)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Balance: ${depositBalance.toFixed(2)} (Short $
                            {(selectedPkg.price - depositBalance).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {depositBalance < selectedPkg.price && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Need to add funds?</span>
                        <Link
                          to="/user/deposit-fund"
                          className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Go to Blockchain Donate Page →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Main Balance */}
              <div
                onClick={() => setPaymentMethod('balance')}
                className={`rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                  paymentMethod === 'balance'
                    ? 'border-[#ff7a1a] bg-[#ff7a1a]/[0.03]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="payment_opt"
                    checked={paymentMethod === 'balance'}
                    onChange={() => setPaymentMethod('balance')}
                    className="mt-1 accent-[#ff7a1a]"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <label className="font-bold text-slate-900 text-sm block cursor-pointer">
                            Main Balance
                          </label>
                          <small className="text-slate-500 text-xs">
                            Pay using your Main Balance (earnings &amp; commissions)
                          </small>
                        </div>
                      </div>

                      <div>
                        {mainBalance >= selectedPkg.price ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Balance: ${mainBalance.toFixed(2)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Balance: ${mainBalance.toFixed(2)} (Short $
                            {(selectedPkg.price - mainBalance).toFixed(2)})
                          </span>
                        )}
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
              {isDailyLimitReached ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-500 text-sm bg-slate-200 cursor-not-allowed"
                >
                  Daily Limit Reached ({donationsToday}/{selectedPkg.dailyLimit})
                </button>
              ) : availablePinsCount > 0 ? (
                <button
                  type="submit"
                  disabled={isSubmitting || !hasBalance}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing donation...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" /> Pay ${selectedPkg.price.toFixed(2)} from{' '}
                      {paymentMethod === 'deposit_wallet' ? 'Donate Wallet' : 'Main Balance'} &amp;
                      Enter Queue
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to={`/user/buy-epins/overview/${selectedPkg.id}?quantity=1`}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 text-sm bg-amber-400 hover:bg-amber-500 transition shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Purchase 1x ${selectedPkg.pinCost.toFixed(2)}{' '}
                  Credit First to Enable Donation
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
