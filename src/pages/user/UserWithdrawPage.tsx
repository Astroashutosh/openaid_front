import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  ExternalLink,
  Lock,
  AlertTriangle,
  History,
  ShieldAlert
} from 'lucide-react';

export const UserWithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const [sourceWallet, setSourceWallet] = useState<'balance' | 'donation_wallet'>('balance');
  const [amount, setAmount] = useState<string>('');
  const [txPassword, setTxPassword] = useState<string>('');
  const [agreed, setAgreed] = useState(false);
  const [isProcessingOverlay, setIsProcessingOverlay] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState('Initiating smart contract transfer...');

  const walletBalances = {
    balance: 245.50,
    donation_wallet: 62.00,
    minWithdraw: 10.00,
    feePercent: 2.00,
    payoutAddress: '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57'
  };

  const currentMax = walletBalances[sourceWallet];
  const parsedAmount = parseFloat(amount) || 0;
  const feeAmount = (parsedAmount * (walletBalances.feePercent / 100));
  const netReceivable = Math.max(0, parsedAmount - feeAmount);

  const handleQuickPercent = (pct: number) => {
    const val = (currentMax * pct).toFixed(2);
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount < walletBalances.minWithdraw || parsedAmount > currentMax || !txPassword || !agreed) return;

    setIsProcessingOverlay(true);
    setOverlayStatus('Validating BEP-20 payout address on BNB Chain...');

    setTimeout(() => {
      setOverlayStatus('Signing decentralized payout authorization...');
    }, 1200);

    setTimeout(() => {
      setOverlayStatus('Broadcasting smart contract transaction hash...');
    }, 2400);

    setTimeout(() => {
      setIsProcessingOverlay(false);
      navigate('/user/withdrawal-report');
    }, 3800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <Link to="/user/my-wallet" className="hover:text-emerald-700">My Wallet</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Withdraw Funds</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Withdraw Funds</h1>
        </div>

        <Link
          to="/user/withdrawal-report"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
        >
          <History className="w-4 h-4" /> Withdraw History
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0c2c23 0%, #114234 45%, #ff7a1a 105%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Payout Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Withdrawal Fund</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed">
              Withdraw your available earnings directly to your verified USDT (BEP-20) Binance Smart Chain wallet.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-right min-w-[200px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Main Balance</div>
            <div className="text-3xl font-black text-amber-300">${walletBalances.balance.toFixed(2)}</div>
            <div className="text-[11px] text-white/70 mt-1">
              Min: ${walletBalances.minWithdraw.toFixed(2)} • Fee: {walletBalances.feePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Verified Payout Destination Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-slate-900 text-sm">Payout Destination</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                USDT BEP-20
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-sky-700 break-all">
              {walletBalances.payoutAddress}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <a
            href={`https://bscscan.com/address/${walletBalances.payoutAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1"
          >
            BscScan <ExternalLink className="w-3 h-3" />
          </a>
          <Link
            to="/user/wallet-address"
            className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-semibold"
          >
            Change
          </Link>
        </div>
      </div>

      {/* Main Withdrawal Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Enter Withdrawal Details</h2>
          <span className="text-xs text-slate-500">Processing Time: <strong>Instant - 24 Hours</strong></span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Wallet Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Withdrawal Wallet Source <span className="text-rose-500">*</span>
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
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-900">Main Balance</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Withdrawable Anytime</span>
                </div>
                <div className="text-xl font-black text-emerald-600 mb-1">${walletBalances.balance.toFixed(2)}</div>
                <p className="text-[11px] text-slate-500">Referral bonuses, commissions & account funds</p>
              </div>

              <div
                onClick={() => setSourceWallet('donation_wallet')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                  sourceWallet === 'donation_wallet'
                    ? 'border-orange-500 bg-orange-50/20 shadow-md shadow-orange-500/10'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-900">Donation Wallet (Surplus)</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px]">Post-Recommit</span>
                </div>
                <div className="text-xl font-black text-sky-600 mb-1">${walletBalances.donation_wallet.toFixed(2)}</div>
                <p className="text-[11px] text-slate-500">Unlocked surplus after package recommitment</p>
              </div>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Withdrawal Amount <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Available: <strong className="text-slate-800">${currentMax.toFixed(2)}</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                min={walletBalances.minWithdraw}
                max={currentMax}
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

            {/* Quick Chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-slate-400 font-medium mr-1">Quick Select:</span>
              {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  {pct === 1.0 ? `Max ($${currentMax.toFixed(2)})` : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Selected Wallet Source</span>
              <strong className="text-slate-800">
                {sourceWallet === 'balance' ? 'Main Balance' : 'Donation Wallet (Unlocked Surplus)'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Minimum Withdrawal</span>
              <span className="text-slate-800">${walletBalances.minWithdraw.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Processing Fee ({walletBalances.feePercent}%)</span>
              <span className="text-rose-600 font-bold">-${feeAmount.toFixed(2)} USDT</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm sm:text-base font-bold text-slate-900">
              <span>You Receive (Net Payout)</span>
              <span className="text-emerald-600 font-black">{netReceivable.toFixed(2)} USDT</span>
            </div>
          </div>

          {/* Transaction Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                className="w-full h-12 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="confirmPayout"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
            />
            <label htmlFor="confirmPayout" className="text-xs text-slate-500 leading-relaxed">
              I confirm that my payout wallet address (<strong className="font-mono text-slate-800">{walletBalances.payoutAddress.slice(0, 6)}...{walletBalances.payoutAddress.slice(-4)}</strong>) is accurate on the Binance Smart Chain (BEP-20) network.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={parsedAmount < walletBalances.minWithdraw || parsedAmount > currentMax || !txPassword || !agreed}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-5 h-5" /> Submit Withdrawal Request
          </button>
        </form>
      </div>

      {/* Full-Page Blocking Overlay Simulation */}
      {isProcessingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-gradient-to-br from-emerald-950 to-slate-950 border border-orange-500/30 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-orange-500/40 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-1">Processing Blockchain Cashout</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Your withdrawal request is being securely broadcasted to the decentralized smart contract.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              {overlayStatus}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left text-xs space-y-1">
              <div className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Please Do Not Close or Refresh
              </div>
              <p className="text-[11px] text-white/70">
                All clicks and duplicates are locked until the blockchain response confirms this transaction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserWithdrawPage;
