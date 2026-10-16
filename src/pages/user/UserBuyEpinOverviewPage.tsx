import React, { useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Building2,
  Lock,
  Minus,
  Plus,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface PackageTier {
  id: number | string;
  title: string;
  price: number;
  pinPrice: number;
}

const PACKAGES: PackageTier[] = [
  { id: 1, title: 'Community Micro Seed', price: 50, pinPrice: 5 },
  { id: 2, title: 'Starter Support Package', price: 100, pinPrice: 10 },
  { id: 3, title: 'Growth Builder Tier', price: 250, pinPrice: 25 },
  { id: 4, title: 'Community Pillar Tier', price: 500, pinPrice: 50 },
  { id: 5, title: 'Global Ambassador Tier', price: 1000, pinPrice: 100 },
  { id: 6, title: 'Ecosystem Crown Tier', price: 2500, pinPrice: 250 },
];

export const UserBuyEpinOverviewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Find package by param id or query or fallback
  const queryPack = searchParams.get('package');
  const selectedPkg =
    PACKAGES.find((p) => String(p.id) === String(id) || String(p.id) === String(queryPack)) ||
    PACKAGES[1]; // default Starter Support ($100)

  const initialQty = parseInt(searchParams.get('quantity') || '1', 10) || 1;
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [txPassword, setTxPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Wallets mock balance matching user deposit wallet
  const depositBalance = 350.0;
  const totalCost = quantity * selectedPkg.pinPrice;
  const hasDepBalance = depositBalance >= totalCost;
  const diffDep = totalCost - depositBalance;

  const handleQtyChange = (val: number) => {
    setQuantity(Math.max(1, val));
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!hasDepBalance) {
      setErrorMessage(`Insufficient Donate Wallet balance. You are short $${diffDep.toFixed(2)}.`);
      return;
    }

    if (!txPassword.trim()) {
      setErrorMessage('Please enter your transaction password to confirm purchase.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        `Successfully purchased ${quantity}x ${selectedPkg.title} Credit(s) for $${totalCost.toFixed(
          2
        )} USDT! Your Credits are ready in your vault.`
      );
      setTxPassword('');
      setTimeout(() => {
        navigate('/user/my-epins');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Header matching epin/overview.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <nav aria-label="breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link to="/user/my-epins" className="hover:text-emerald-700">
                  My Credits
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/user/buy-epins" className="hover:text-emerald-700">
                  Packages
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-900 font-bold" aria-current="page">
                Overview &amp; Checkout
              </li>
            </ol>
          </nav>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E2718]">
            Credits Package Overview &amp; Checkout
          </h2>
        </div>
        <Link
          to="/user/buy-epins"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Change Package
        </Link>
      </div>

      {/* Steps Indicator matching epin/overview.blade.php */}
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
            <span>2. Quantity &amp; Payment</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-400 inline-flex items-center justify-center text-xs">
              3
            </span>
            <span className="hidden sm:inline">3. Pins Assigned</span>
          </div>
        </div>
      </div>

      {/* Error & Success Alerts */}
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
        {/* LEFT COLUMN: Package Overview & Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedPkg.title} Credits
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Package
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-xl mt-4 mb-1">
                {selectedPkg.title} Credits
              </h3>
              <div className="text-4xl font-black text-[#ff7a1a] my-2">
                ${totalCost.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span>{quantity}</span>x ${selectedPkg.pinPrice.toFixed(2)} Credits for $
                {selectedPkg.price.toFixed(0)} Donation Tier
              </p>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Highlight Box matching Blade #FAF8F5 */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ff7a1a]/20 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Quantity to Purchase:</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {quantity} Credit(s)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Unit Cost (10%):</span>
                  <strong className="text-slate-900">${selectedPkg.pinPrice.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Activates Tier:</span>
                  <strong className="text-slate-900">
                    ${selectedPkg.price.toFixed(2)} Donation
                  </strong>
                </div>
              </div>

              {/* Credit Highlights List */}
              <div>
                <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5">
                  Credit Highlights:
                </h6>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant crediting to your account upon confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Required to enter the 2:1 Sequential FIFO Queue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Transferable peer-to-peer to any active member</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Permanent validity with zero expiration date</span>
                  </li>
                </ul>
              </div>

              {/* Order Price Breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Credit Unit Price:</span>
                  <span>${selectedPkg.pinPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Quantity Ordered:</span>
                  <span className="font-bold text-slate-900">{quantity} Pin(s)</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 text-sm font-black text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-lg text-[#ff7a1a]">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
              <Link
                to="/user/buy-epins"
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Choose a different Credit package
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quantity Selection & Payment Wallets (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-100">
              <h5 className="font-black text-slate-900 text-base mb-1">
                Credit Quantity &amp; Payment Wallet
              </h5>
              <p className="text-xs text-slate-500">
                Specify the number of Credits and choose your payment wallet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* QUANTITY SELECTOR BOX matching Blade */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ff7a1a]/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-0.5">
                      Enter Quantity Needed:
                    </label>
                    <small className="text-[11px] text-slate-500">
                      ${selectedPkg.pinPrice.toFixed(2)} per Credit (10% of $
                      {selectedPkg.price.toFixed(0)} package)
                    </small>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold flex items-center justify-center transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={quantity}
                      onChange={(e) => handleQtyChange(parseInt(e.target.value, 10) || 1)}
                      className="w-16 h-8 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleQtyChange(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold flex items-center justify-center transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#ff7a1a]/15 text-xs">
                  <span className="text-slate-600">Total Payment Required:</span>
                  <strong className="text-base font-black text-[#ff7a1a]">
                    ${totalCost.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* PAYMENT OPTION 1: Donate Wallet */}
              <div>
                <h6 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Select Payment Wallet:
                </h6>

                <div className="rounded-2xl border-2 border-[#ff7a1a] bg-[#ff7a1a]/[0.03] p-4 transition-all">
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="payment_method"
                      id="optDepositWallet"
                      value="deposit_wallet"
                      checked
                      readOnly
                      className="mt-1 accent-[#ff7a1a]"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <label
                              htmlFor="optDepositWallet"
                              className="font-bold text-slate-900 text-sm block cursor-pointer"
                            >
                              Donate Wallet
                            </label>
                            <small className="text-slate-500 text-xs">
                              Pay using funds deposited via Blockchain
                            </small>
                          </div>
                        </div>

                        <div>
                          {hasDepBalance ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Balance: ${depositBalance.toFixed(2)}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Balance: ${depositBalance.toFixed(2)} (Short ${diffDep.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>

                      {!hasDepBalance && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Need to Donate funds?</span>
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
              <button
                type="submit"
                disabled={isSubmitting || !hasDepBalance}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing purchase...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" /> Pay ${totalCost.toFixed(2)} from Donate Wallet
                    &amp; Get {quantity} Credit(s)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
