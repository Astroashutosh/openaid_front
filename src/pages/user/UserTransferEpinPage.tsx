import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Send,
  User,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  SortAsc
} from 'lucide-react';

export const UserTransferEpinPage: React.FC = () => {
  const [packageId, setPackageId] = useState<number>(2);
  const [recipientUsername, setRecipientUsername] = useState<string>('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [recipientStatus, setRecipientStatus] = useState<{ checked: boolean; valid: boolean; name?: string }>({
    checked: false,
    valid: false
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [txPassword, setTxPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const packages = [
    { id: 1, title: 'Community Micro Seed', count: 1, price: 5.0 },
    { id: 2, title: 'Starter Support Package', count: 2, price: 10.0 },
    { id: 3, title: 'Growth Builder Tier', count: 1, price: 25.0 },
    { id: 4, title: 'Community Pillar Tier', count: 0, price: 50.0 }
  ];

  const totalAvailable = packages.reduce((acc, curr) => acc + curr.count, 0);
  const currentPkg = packages.find((p) => p.id === packageId) || packages[1];

  const handleUserInputChange = (val: string) => {
    setRecipientUsername(val);
    setRecipientStatus({ checked: false, valid: false });
    setErrorMsg(null);

    if (val.trim().length >= 3) {
      setIsCheckingUser(true);
      setTimeout(() => {
        setIsCheckingUser(false);
        if (val.toLowerCase().includes('oai') || val.toLowerCase().includes('alex') || val.length >= 4) {
          setRecipientStatus({ checked: true, valid: true, name: `Alex Johnson (${val.toUpperCase()})` });
        } else {
          setRecipientStatus({ checked: true, valid: false });
        }
      }, 350);
    } else {
      setIsCheckingUser(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!recipientStatus.valid) {
      setErrorMsg('Please enter a valid recipient username.');
      return;
    }

    if (!txPassword.trim()) {
      setErrorMsg('Please enter your transaction password.');
      return;
    }

    if (quantity > currentPkg.count) {
      setErrorMsg(`You only have ${currentPkg.count} Credit(s) available for this tier.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(
        `Successfully transferred ${quantity}x ${currentPkg.title} Credit(s) to ${recipientUsername.toUpperCase()}!`
      );
      setRecipientUsername('');
      setRecipientStatus({ checked: false, valid: false });
      setTxPassword('');
      setTimeout(() => setSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions matching transfer.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E2718] mb-1">
            Transfer Credit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Transfer package-specific activation Credits to any registered member using their username.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/user/buy-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-50 text-xs font-bold transition"
          >
            <ShoppingCart className="w-4 h-4 text-amber-500" /> Buy Credits
          </Link>
          <Link
            to="/user/my-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to My Credits
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Available Banner matching Blade */}
          <div className="p-3.5 rounded-2xl bg-[#eefbf3] border border-[#c3edd2] flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Ticket className="w-4 h-4 text-emerald-600" /> Total Available Credits:
            </span>
            <strong className="text-emerald-700 font-black text-sm sm:text-base">
              {totalAvailable} Credit(s)
            </strong>
          </div>

          {totalAvailable <= 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-4xl">🎟️</div>
              <h6 className="font-bold text-slate-900 text-base">No Credits Available to Transfer</h6>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You need to purchase a Credits package before you can transfer Credits to other members.
              </p>
              <Link
                to="/user/buy-epins"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#ea6b14] text-white text-xs font-bold transition shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" /> Buy Credit Package
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Package Credits Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Donation Package Credit <span className="text-rose-500">*</span>
                </label>
                <select
                  value={packageId}
                  onChange={(e) => {
                    const newId = parseInt(e.target.value, 10);
                    setPackageId(newId);
                    setQuantity(1);
                  }}
                  className="w-full h-11 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">-- Choose Package Tier --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} disabled={pkg.count <= 0}>
                      {pkg.title} Credit (${pkg.price.toFixed(0)}) — {pkg.count} Available
                    </option>
                  ))}
                </select>
                <small className="text-[11px] text-slate-400 mt-1 block">
                  Only Credits belonging to the selected package tier will be transferred.
                </small>
              </div>

              {/* Recipient Username */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Recipient Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={recipientUsername}
                    onChange={(e) => handleUserInputChange(e.target.value)}
                    placeholder="Enter Recipient User ID (e.g. OAI123456)"
                    required
                    autoComplete="off"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                {isCheckingUser && (
                  <div className="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                    <span>Checking username...</span>
                  </div>
                )}
                {!isCheckingUser && recipientStatus.checked && (
                  <div className="mt-1.5 text-xs font-semibold">
                    {recipientStatus.valid ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Recipient: <strong>{recipientStatus.name}</strong>
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Recipient username not found.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Quantity of Credits <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <SortAsc className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, currentPkg.count)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    required
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
                  <span>
                    Total value: <strong className="text-slate-900">${(quantity * currentPkg.price).toFixed(2)}</strong>
                  </span>
                  <span>Max available: {currentPkg.count} Credit(s)</span>
                </div>
              </div>

              {/* Transaction Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Transaction Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={txPassword}
                    onChange={(e) => setTxPassword(e.target.value)}
                    placeholder="Enter your transaction password"
                    required
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <small className="text-slate-400 text-[11px] mt-1 block">
                  Required to confirm transfer authorization.
                </small>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || currentPkg.count <= 0 || !recipientStatus.valid || !txPassword}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm bg-[#0E2718] hover:bg-[#163c25] disabled:opacity-50 transition shadow-md shadow-[#0E2718]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authorizing transfer...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Confirm &amp; Transfer Credit
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
