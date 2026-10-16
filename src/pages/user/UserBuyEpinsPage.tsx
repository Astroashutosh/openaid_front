import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Trophy,
  Ticket,
  CheckCircle2,
  ShoppingCart,
  Send,
  PlusCircle
} from 'lucide-react';

export const UserBuyEpinsPage: React.FC = () => {
  const [successMsg] = useState<string | null>(null);

  const walletSummary = {
    depositBalance: 150.00,
    balance: 245.50,
    availableCount: 3
  };

  const packages = [
    {
      id: 1,
      title: 'Community Micro Seed',
      price: 50.00,
      pinCost: 5.00
    },
    {
      id: 2,
      title: 'Starter Support Package',
      price: 100.00,
      pinCost: 10.00
    },
    {
      id: 3,
      title: 'Growth Helping Tier',
      price: 200.00,
      pinCost: 20.00
    },
    {
      id: 4,
      title: 'Leadership Impact Pool',
      price: 500.00,
      pinCost: 50.00
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0E2718] mb-1">Buy Package Credits</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Purchase activation Credits strictly tied to your chosen donation package tier.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/user/deposit-fund"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors"
          >
            <Wallet className="w-4 h-4 text-amber-600" /> Donate Funds
          </Link>
          <Link
            to="/user/my-epins"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Ticket className="w-4 h-4" /> My Credits
          </Link>
          <Link
            to="/user/transfer-epin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors"
          >
            <Send className="w-4 h-4 text-emerald-600" /> Transfer Credit
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* User Wallet Summary Bar (3 cards from buy.blade.php) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Donate Wallet */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Donate Wallet</span>
            <div className="text-2xl font-black text-emerald-600 my-0.5">
              ${walletSummary.depositBalance.toFixed(2)}
            </div>
            <Link to="/user/deposit-fund" className="text-xs font-bold text-[#FF7A1A] hover:underline inline-flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5" /> Add Fund
            </Link>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}
          >
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Main Balance */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Main Balance</span>
            <div className="text-2xl font-black text-blue-600 my-0.5">
              ${walletSummary.balance.toFixed(2)}
            </div>
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
              ⚡ Usable for Credit Buy
            </span>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}
          >
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Available Credits Owned */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Available Credits Owned</span>
            <div className="text-2xl font-black text-slate-900 my-0.5">
              {walletSummary.availableCount} Credits
            </div>
            <span className="text-xs text-slate-500">Ready for donations</span>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}
          >
            🎟️
          </div>
        </div>
      </div>

      {/* Rule Banner (matching buy.blade.php) */}
      <div
        className="rounded-2xl p-4 sm:p-5 border-0 shadow-sm flex items-start gap-3.5"
        style={{ background: '#fff8eb' }}
      >
        <span className="text-2xl">📌</span>
        <div>
          <strong className="text-slate-900 block text-sm mb-1">Package-Tied Credits System:</strong>
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed m-0">
            Each donation package requires its corresponding package Credits (10% Credit price):{' '}
            <strong>$100 Pack = $10 Credit</strong> • <strong>$200 Pack = $20 Credit</strong> • <strong>$500 Pack = $50 Credit</strong>.
            You can purchase any quantity needed using your <strong>Donate Wallet</strong> or <strong>Commission Wallet</strong>.
          </p>
        </div>
      </div>

      {/* Credits Packages Grid (Donation Package Tied) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {packages.map((pack) => (
          <div
            key={pack.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all text-center p-5 sm:p-6"
          >
            <div>
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl mb-3"
                style={{ background: 'rgba(255, 122, 26, 0.1)', color: '#FF7A1A' }}
              >
                🎟️
              </div>
              <h2 className="text-base font-bold text-[#0E2718] mb-0.5">{pack.title} Credit</h2>
              <div className="text-xs text-slate-500 mb-2">Package Activation Credit</div>

              <div className="text-3xl font-black my-2" style={{ color: '#FF7A1A' }}>
                ${pack.pinCost.toFixed(0)}{' '}
                <span className="text-xs font-normal text-slate-400">/ Credit</span>
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
                Activates ${pack.price.toFixed(0)} Package
              </span>

              <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3 mb-4 text-left">
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donation Tier:</span>
                  <strong className="text-slate-900">${pack.price.toFixed(0)}</strong>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Credit Cost:</span>
                  <strong className="text-emerald-600 font-bold">${pack.pinCost.toFixed(2)} (10%)</strong>
                </li>
                <li className="flex justify-between py-1">
                  <span className="text-slate-500">Transferable:</span>
                  <span className="text-emerald-600 font-semibold">✓ Peer-to-Peer</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                to={`/user/buy-epins/overview/${pack.id}`}
                className="w-full py-3 rounded-xl text-white font-bold text-[14px] shadow-sm transition-all hover:opacity-95 flex items-center justify-center gap-1.5"
                style={{ background: '#FF7A1A' }}
              >
                <ShoppingCart className="w-4 h-4" /> Proceed to Checkout →
              </Link>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default UserBuyEpinsPage;
