import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';

export const UserTransferToDepositPage: React.FC = () => {
  const [sourceWallet, setSourceWallet] = useState<'balance' | 'donation_withdrawable'>('balance');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const walletBalances = {
    balance: 245.50,
    donation_withdrawable: 62.00,
    depositBalance: 150.00
  };

  const currentAvailable = walletBalances[sourceWallet];

  const handleQuickPercent = (pct: number) => {
    const val = (currentAvailable * pct).toFixed(2);
    setAmount(val);
  };

  const parsedAmount = parseFloat(amount) || 0;
  const netCredit = parsedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0 || parsedAmount > currentAvailable) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(`Successfully transferred $${parsedAmount.toFixed(2)} USDT to your Donate Wallet!`);
      setAmount('');
      setTimeout(() => setSuccessMsg(null), 5000);
    }, 1200);
  };

  const history = [
    { id: 'TRF#1024', source: 'Commission Wallet (Main)', amount: 50.00, credited: 50.00, date: 'Oct 11, 2026 03:15 PM', status: 'Completed' },
    { id: 'TRF#0982', source: 'Withdrawable Surplus', amount: 30.00, credited: 30.00, date: 'Oct 08, 2026 10:45 AM', status: 'Completed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-sm bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <Link to="/user/dashboard" className="text-slate-500 hover:text-emerald-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <Link to="/user/my-wallet" className="text-slate-500 hover:text-emerald-700 font-medium">My Wallet</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold">Transfer to Donate Wallet</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0c2c23 0%, #114234 45%, #ff7a1a 105%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ArrowRightLeft className="w-3.5 h-3.5" /> Internal Wallet Exchange
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Transfer to Donate Wallet</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed">
              Convert your earned commission or withdrawable surplus into Donate Wallet balance with 0% fee to purchase package Credits and make new queue donations.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Donate Wallet</div>
              <div className="text-2xl font-black text-amber-300">${walletBalances.depositBalance.toFixed(2)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Main Balance</div>
              <div className="text-xl font-bold text-white">${walletBalances.balance.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Transfer Form</h2>
          <span className="text-xs text-slate-500">Instant Execution • 0% Fee</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Source Wallet Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Select Source Wallet <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSourceWallet('balance')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                  sourceWallet === 'balance'
                    ? 'border-orange-500 bg-orange-50/20 shadow-md shadow-orange-500/10'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">Commission Wallet (Main)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Liquid</span>
                </div>
                <div className="text-xl font-black text-emerald-600 mb-1">
                  ${walletBalances.balance.toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-500">Available commissions and rewards</p>
              </div>

              <div
                onClick={() => setSourceWallet('donation_withdrawable')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                  sourceWallet === 'donation_withdrawable'
                    ? 'border-orange-500 bg-orange-50/20 shadow-md shadow-orange-500/10'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">Withdrawable Surplus</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">+62% Unlocked</span>
                </div>
                <div className="text-xl font-black text-sky-600 mb-1">
                  ${walletBalances.donation_withdrawable.toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-500">Unlocked cycle returns from completed donations</p>
              </div>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Enter Transfer Amount <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Max Available: <strong className="text-slate-800">${currentAvailable.toFixed(2)}</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                min="1"
                max={currentAvailable}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full h-14 pl-5 pr-20 text-xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                USDT
              </span>
            </div>

            {/* Quick Percentage Chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-slate-400 font-medium mr-1">Quick Select:</span>
              {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  {pct === 1.0 ? 'Max (100%)' : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Transfer Source</span>
              <strong className="text-slate-800">
                {sourceWallet === 'balance' ? 'Commission Wallet (Main)' : 'Withdrawable Surplus (+62%)'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Transfer Amount</span>
              <strong className="text-slate-800">${parsedAmount.toFixed(2)} USDT</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Processing Fee</span>
              <span className="text-emerald-600 font-bold">0% (Free)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm sm:text-base font-bold text-slate-900">
              <span>Net Credited to Donate Wallet</span>
              <span className="text-emerald-600 font-black">${netCredit.toFixed(2)} USDT</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || parsedAmount <= 0 || parsedAmount > currentAvailable}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Transferring...</span>
            ) : (
              <>
                <ArrowRightLeft className="w-5 h-5" />
                Confirm Transfer ${parsedAmount > 0 ? parsedAmount.toFixed(2) : '0.00'} USDT
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transfer History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Transfer History</h3>
          <span className="text-xs font-semibold text-slate-500">{history.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Transfer ID</th>
                <th className="px-4 py-3.5">Source Wallet</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-right">Credited</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-700">{item.id}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">{item.source}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-800">${item.amount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-black text-emerald-600">${item.credited.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 text-xs">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default UserTransferToDepositPage;
