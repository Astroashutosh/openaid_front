import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Zap,
  History
} from 'lucide-react';

export const UserDepositPage: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const depositBalance = 150.00;
  const companyAddress = '0x12a9C998B6F88E07994E928b981884Be13554A62';
  const userWeb3Address = '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57';

  const quickAmounts = [50, 100, 200, 300, 500, 1000];

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount) || 0;
    if (num < 1) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTxSuccess(`0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <Link to="/user/my-wallet" className="hover:text-emerald-700">My Wallet</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Donate Funds</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">Donate Wallet</h1>
          <p className="text-xs text-slate-500">
            Donate USDT (BEP-20) from your Web3 wallet directly into your Donate Wallet for packages & Credits purchase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/user/deposit/history"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <History className="w-4 h-4" /> Donate History
          </Link>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-600" /> Donate Wallet: <strong>${depositBalance.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {txSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Blockchain Deposit Broadcasted Successfully!
          </div>
          <p className="text-xs text-emerald-700">
            Your transaction has been validated on BNB Smart Chain. Your Donate Wallet will reflect the new balance once 3 block confirmations are completed.
          </p>
          <div className="text-xs font-mono text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200/80 break-all">
            Tx Hash: {txSuccess}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Deposit Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              ⚡ USDT BEP-20 (BNB Chain)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3.5 h-3.5 text-emerald-600" /> Instant Credit
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 mb-1">Add Funds to Donate Wallet</h2>
            <p className="text-xs text-slate-500">Select an amount or enter custom amount to transfer from Web3 Wallet.</p>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-6">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Select Amount (USDT):
              </label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      amount === q.toString()
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 border-orange-500'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ${q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Donate Amount (USDT) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  required
                  className="w-full h-14 pl-10 pr-20 text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600">
                  USDT
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 mt-1.5">
                Minimum Donate: $1.00 USDT. Protocol fee: $0 (Free).
              </span>
            </div>

            {/* Web3 Wallet Information Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Network:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> BNB Smart Chain (BEP-20)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Your Connected Wallet:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                  {userWeb3Address}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Smart Contract Address:</span>
                <span className="font-mono text-slate-500">
                  {companyAddress.slice(0, 6)}...{companyAddress.slice(-4)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !amount || parseFloat(amount) < 1}
              className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Confirming Web3 Transaction...</span>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Donate ${parseFloat(amount || '0').toFixed(2)} USDT
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Information & Policy Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 text-white shadow-xl"
               style={{ background: 'linear-gradient(135deg, #0c2c23 0%, #165b4c 100%)' }}>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" /> Donate Wallet Policy
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Funds added to your <strong>Donate Wallet</strong> are used exclusively for activating donation packages and purchasing Credits.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3 text-xs mb-5">
              <div className="flex justify-between items-center text-white/80">
                <span>Current Donate Balance:</span>
                <strong className="text-amber-300 text-base font-black">${depositBalance.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Donate Fee:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">0% FREE</span>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>Crediting Engine:</span>
                <span className="text-emerald-300 font-bold">Automated BSC Listener</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-emerald-100/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Zero deposit fees charged by OpenAid protocol</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Instant on-chain settlement upon 3 BSC confirmations</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Compatible with MetaMask, Trust Wallet & Binance Web3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDepositPage;
