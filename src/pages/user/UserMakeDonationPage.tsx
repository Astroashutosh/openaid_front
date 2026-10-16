import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Ticket,
  PlusCircle,
  ListOrdered,
  RotateCcw,
  Clock,
  TrendingUp,
  Info,
  Zap
} from 'lucide-react';

interface DonationPackage {
  id: number;
  title: string;
  price: number;
  expectedPayout: number;
  creditCost: number;
  dailyLimit: number;
  donatedToday: number;
  creditsAvailable: number;
}

export const UserMakeDonationPage: React.FC = () => {

  const walletSummary = {
    depositBalance: 150.00,
    balance: 245.50,
    donationWallet: 100.00,
    donationWithdrawable: 62.00,
    activeQueueCount: 1
  };

  const completedCycles = [
    {
      id: 104,
      packageName: 'Starter Support Package',
      lendAmount: 100.00,
      earned: 162.00,
      surplus: 62.00,
      pinsAvailable: 2,
      pinPrice: 10.00
    }
  ];

  const packages: DonationPackage[] = [
    {
      id: 1,
      title: 'Community Micro Seed',
      price: 50.00,
      expectedPayout: 81.00,
      creditCost: 5.00,
      dailyLimit: 3,
      donatedToday: 0,
      creditsAvailable: 1
    },
    {
      id: 2,
      title: 'Starter Support Package',
      price: 100.00,
      expectedPayout: 162.00,
      creditCost: 10.00,
      dailyLimit: 3,
      donatedToday: 1,
      creditsAvailable: 2
    },
    {
      id: 3,
      title: 'Growth Helping Tier',
      price: 200.00,
      expectedPayout: 324.00,
      creditCost: 20.00,
      dailyLimit: 3,
      donatedToday: 0,
      creditsAvailable: 0
    },
    {
      id: 4,
      title: 'Leadership Impact Pool',
      price: 500.00,
      expectedPayout: 810.00,
      creditCost: 50.00,
      dailyLimit: 3,
      donatedToday: 0,
      creditsAvailable: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase mb-1">
            <Heart className="w-3.5 h-3.5" /> Community Helping Protocol
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Make Donation (MD)</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Choose your donation package and earn 162% (2x 81%) returns with 10% package-tied Credit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/user/live-queue-tracker"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-sky-600" /> Live Queue Tracker
          </Link>
          <Link
            to="/user/deposit-fund"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Donate USDT
          </Link>
          <Link
            to="/user/buy-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black shadow-md shadow-amber-400/20 transition-all"
          >
            <Ticket className="w-4 h-4" /> Buy Credit
          </Link>
        </div>
      </div>

      {/* 4-Wallet Ecosystem Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Donate Wallet */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                For Purchase
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Donate Wallet</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${walletSummary.depositBalance.toFixed(2)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Add Fund:</span>
            <Link to="/user/deposit-fund" className="text-emerald-600 font-bold hover:underline">
              Donate +
            </Link>
          </div>
        </div>

        {/* Main Available Balance */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700">
                Main Balance
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${walletSummary.balance.toFixed(2)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Withdraw Fund:</span>
            <Link to="/user/withdraw-usdt" className="text-sky-600 font-bold hover:underline">
              Withdraw →
            </Link>
          </div>
        </div>

        {/* Redonation Wallet */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                2x 81% Returns
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Redonation Wallet</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${walletSummary.donationWallet.toFixed(2)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Recommit:</span>
            <Link to="/user/recommitment" className="text-amber-600 font-bold hover:underline">
              Recommit →
            </Link>
          </div>
        </div>

        {/* Withdrawable Surplus */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-500 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                Unlocked
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Withdrawable Surplus</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 my-1">
              ${walletSummary.donationWithdrawable.toFixed(2)}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ready for cashout:</span>
            <Link to="/user/withdraw-usdt" className="text-emerald-600 font-bold hover:underline">
              Cashout →
            </Link>
          </div>
        </div>
      </div>

      {/* Active Queue Alert */}
      {walletSummary.activeQueueCount > 0 && (
        <div className="p-4 rounded-2xl bg-sky-50 border-l-4 border-l-sky-500 border border-sky-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-800 font-medium">
              You currently have <strong>{walletSummary.activeQueueCount}</strong> active donation position progressing in the 2:1 FIFO Queue.
            </span>
          </div>
          <Link
            to="/user/live-queue-tracker"
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
          >
            View Live Queue Tracker →
          </Link>
        </div>
      )}

      {/* Completed Cycles Awaiting Recommitment */}
      {completedCycles.length > 0 && (
        <div className="rounded-3xl p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Completed Cycles Awaiting Recommitment</h3>
                <p className="text-xs text-slate-600">
                  You earned <strong>162% (2x 81%)</strong> in your Donation Wallet! Recommit the package using your Donation Wallet balance + 1x Package Credit to enter a fresh queue position and unlock your surplus balance for immediate cashout.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
              {completedCycles.length} Cycle Ready to Recommit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {completedCycles.map((cycle) => (
              <div key={cycle.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">Cycle Completed</span>
                  <span className="text-slate-400 font-mono">#{cycle.id}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{cycle.packageName} (${cycle.lendAmount.toFixed(2)})</div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>Earned: <strong className="text-emerald-600 font-bold">${cycle.earned.toFixed(2)}</strong></div>
                  <div>Surplus to Unlock: <strong className="text-sky-600 font-bold">${cycle.surplus.toFixed(2)}</strong></div>
                  <div>
                    Package Credit: <span className="text-emerald-600 font-bold">✓ {cycle.pinsAvailable} Ready</span>
                  </div>
                </div>
                <Link
                  to={`/user/recommitment/overview/${cycle.id}`}
                  className="block w-full text-center py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                >
                  Proceed to Recommit →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Donation Packages Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-orange-500" /> Choose a Donation Package
            </h2>
            <p className="text-xs text-slate-500">Required: Package Cost + 1x Package-Tied Credit (10%)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => {
            const hasDailyLimit = pkg.dailyLimit > 0;
            const isLimitReached = hasDailyLimit && pkg.donatedToday >= pkg.dailyLimit;
            const hasCredits = pkg.creditsAvailable > 0;

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border-t-4 border-t-orange-500 border border-slate-200/80 shadow-sm p-5 text-center flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  {/* Badge & Limit */}
                  <div className="flex items-center justify-between gap-1 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {pkg.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {pkg.donatedToday}/{pkg.dailyLimit} Today
                    </span>
                  </div>

                  {/* Price & Payout */}
                  <div className="my-2">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900">
                      ${pkg.price.toFixed(2)}
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mt-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Expected Payout: ${pkg.expectedPayout.toFixed(2)} (162%)
                    </div>
                  </div>

                  {/* Specifications Box */}
                  <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3.5 my-4 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Required Credit:</span>
                      <strong className="text-slate-800">1x Credit (${pkg.creditCost.toFixed(2)})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your Available Credit:</span>
                      {hasCredits ? (
                        <strong className="text-emerald-600 font-bold">✓ {pkg.creditsAvailable} Ready</strong>
                      ) : (
                        <strong className="text-rose-500 font-bold">0 Available</strong>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Donation Return:</span>
                      <strong className="text-emerald-600 font-bold">162% Return</strong>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {isLimitReached ? (
                    <button disabled className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed">
                      Daily Limit Reached
                    </button>
                  ) : hasCredits ? (
                    <Link
                      to={`/user/make-donation/overview/${pkg.id}`}
                      className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-4 h-4" /> Make Donation →
                    </Link>
                  ) : (
                    <Link
                      to={`/user/buy-epins/overview/${pkg.id}?quantity=1`}
                      className="block w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 inline mr-1" /> Buy ${pkg.creditCost.toFixed(2)} Credit
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default UserMakeDonationPage;
