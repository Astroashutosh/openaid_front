import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  CheckCircle2,
  Lock,
  History,
  CheckCheck,
  HandCoins,
  Unlock,
  Layers
} from 'lucide-react';

export const UserRecommitmentPage: React.FC = () => {
  const [successMsg] = useState<string | null>(null);

  const walletData = {
    donationWallet: 100.00,
    lockedProfit: 62.00,
    availableProfit: 62.00,
    creditsCount: 2
  };

  const pendingPositions = [
    {
      id: 104,
      packageName: 'Starter Support Package',
      lendAmount: 100.00,
      earned: 162.00,
      surplus: 62.00,
      pinPrice: 10.00,
      availablePins: 2
    }
  ];

  const recommittedPositions = [
    {
      id: 101,
      packageName: 'Community Micro Seed',
      lendAmount: 50.00,
      returnAmount: 81.00,
      surplusUnlocked: 31.00,
      recommitDate: '26 Sep 2026, 04:12 PM',
      status: 'Cycle Complete & Recommitted'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold tracking-[0.5px] text-[#d97706] bg-[#fef3c7] border border-[#fde68a] uppercase mb-2">
            <RotateCcw className="w-3.5 h-3.5" />
            SUSTAINABILITY & RECOMMITMENT PROTOCOL
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0c2c23] mb-1">Recommitment Protocol</h1>
          <p className="text-xs sm:text-[13.5px] text-slate-500">
            Recommit your completed donation packages using your Redonation Wallet balance + 1x Credit to unlock your 62% net surplus for withdrawal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/user/make-donation"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            ← Make Donation
          </Link>
          <Link
            to="/user/withdraw-usdt"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            Withdraw Unlocked Surplus (${walletData.availableProfit.toFixed(2)})
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Dynamic Protocol Status Banner (Recommitment Pending) */}
      <div
        className="rounded-[16px] p-5 shadow-sm border border-amber-200"
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderLeft: '5px solid #f59e0b'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f59e0b] text-slate-950 inline-block mb-1">
                RECOMMITMENT PENDING
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#92400e] mb-0.5">
                ${walletData.lockedProfit.toFixed(2)} Surplus Awaiting Recommitment
              </h2>
              <p className="text-xs sm:text-[13.5px] text-slate-600 max-w-2xl leading-relaxed">
                You have <strong>{pendingPositions.length} completed donation cycle(s)</strong> (earned 162% in your Donation Wallet). Per community rules, recommit the package amount to enter a new queue position and release your surplus to Withdrawable Donation Wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Cycles */}
        <div className="bg-white rounded-[16px] p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <CheckCheck className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                162% Return
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Cycles</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              {pendingPositions.length + recommittedPositions.length}
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Recommit:</span>
            <strong className="text-amber-600">{pendingPositions.length}</strong>
          </div>
        </div>

        {/* Card 2: Redonation Wallet Balance */}
        <div className="bg-white rounded-[16px] p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <HandCoins className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                Redonation Wallet
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Redonation Wallet</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${walletData.donationWallet.toFixed(2)}
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Locked Surplus:</span>
            <strong className="text-amber-600">${walletData.lockedProfit.toFixed(2)}</strong>
          </div>
        </div>

        {/* Card 3: Unlocked Surplus (Withdrawable) */}
        <div
          className="bg-white rounded-[16px] p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          style={{ borderLeft: '4px solid #10b981' }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Unlock className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                Withdrawable
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unlocked Surplus</div>
            <div className="text-xl sm:text-2xl font-black text-[#10b981] my-1">
              ${walletData.availableProfit.toFixed(2)}
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cashout Status:</span>
            <Link to="/user/withdraw-usdt" className="text-[#10b981] font-bold hover:underline">
              Withdraw Now →
            </Link>
          </div>
        </div>

        {/* Card 4: Active Queued Positions */}
        <div className="bg-white rounded-[16px] p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                Active Queue
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Positions</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              1
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Queued Capital:</span>
            <strong className="text-slate-800">$100.00</strong>
          </div>
        </div>
      </div>

      {/* PENDING RECOMMITMENT SECTION */}
      {pendingPositions.length > 0 && (
        <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-0.5">
                <RotateCcw className="w-4 h-4 text-amber-500" /> Pending Cycles Ready for Recommitment
              </h2>
              <p className="text-xs text-slate-500">
                Recommit the package using your Redonation Wallet balance + 1x Credit to unlock surplus into Withdrawable Wallet.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {pendingPositions.length} Pending
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPositions.map((pLog) => (
                <div key={pLog.id} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 shadow-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                        Awaiting Recommit
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-white border border-slate-200 text-slate-500 font-mono">
                        #{pLog.id}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">{pLog.packageName}</h3>

                    <div className="text-xs text-slate-600 space-y-1.5 mb-4">
                      <div className="flex justify-between py-1 border-b border-slate-200/70">
                        <span>Earned Return (162%):</span>
                        <strong className="text-emerald-600 font-bold">${pLog.earned.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/70">
                        <span>Recommit Required:</span>
                        <strong className="text-slate-900">${pLog.lendAmount.toFixed(2)} + 1x Credit</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/70">
                        <span>Surplus Unlocked:</span>
                        <strong className="text-blue-600 font-bold text-sm">+${pLog.surplus.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Package Credits Available:</span>
                        {pLog.availablePins > 0 ? (
                          <strong className="text-emerald-600 font-bold">✓ {pLog.availablePins} Ready</strong>
                        ) : (
                          <strong className="text-rose-600 font-bold">0 Ready (${pLog.pinPrice.toFixed(2)})</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/user/recommitment/overview/${pLog.id}`}
                      className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Proceed to Recommit →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED & RECOMMITTED CYCLES HISTORY */}
      <div className="bg-white rounded-[18px] border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-0.5">
              <History className="w-4 h-4 text-slate-500" /> Recommitment History
            </h2>
            <p className="text-xs text-slate-500">
              Positions that completed the 2:1 matching cycle and were recommitted.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {recommittedPositions.length} Recommitted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5">Position ID</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Capital</th>
                <th className="px-4 py-3.5 text-right">162% Return</th>
                <th className="px-4 py-3.5 text-right">Surplus Unlocked</th>
                <th className="px-4 py-3.5">Recommit Date</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommittedPositions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-700">POS-#{item.id}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{item.packageName}</td>
                  <td className="px-4 py-3.5 text-slate-700 font-semibold">${item.lendAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">${item.returnAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-black text-blue-600">+${item.surplusUnlocked.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{item.recommitDate}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Complete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRecommitmentPage;
