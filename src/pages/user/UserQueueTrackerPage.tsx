import React from 'react';
import { Link } from 'react-router-dom';
import {
  ListOrdered,
  RotateCcw,
  PlusCircle,
  Ticket,
  TrendingUp,
  Layers,
  Zap,
  Flag,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const UserQueueTrackerPage: React.FC = () => {
  const kpiData = {
    totalActivePositions: 1,
    availablePinsCount: 3,
    totalLendAmountInQueue: 100.00,
    totalTargetReturnInQueue: 162.00,
    totalReceivedInQueue: 81.00,
    bestAhead: 0 // Next in line!
  };

  const activeLogs = [
    {
      id: 105,
      referenceNo: 'POS-20261011-8841',
      packageName: 'Starter Support Package',
      lendAmount: 100.00,
      targetReturn: 162.00,
      receivedAmount: 81.00,
      donorsAhead: 0,
      queuePosition: 1,
      donorsReceivedCount: 1,
      maxDonors: 2,
      createdAt: '11 Oct 2026, 04:30 PM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold tracking-[0.5px] text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
            Real-Time 2:1 FIFO Matching Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0E2718] mb-1">Live 2:1 FIFO Queue Tracker</h1>
          <p className="text-xs sm:text-[14px] text-slate-500">
            Transparent, real-time monitoring of your active donation positions and community queue progression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
          <Link
            to="/user/buy-epins"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-[13px] font-bold shadow-sm transition-all"
          >
            <Ticket className="w-4 h-4" /> Buy Credit
          </Link>
          <Link
            to="/user/make-donation"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-[13px] font-bold shadow-sm transition-all"
            style={{ background: '#FF7A1A' }}
          >
            <PlusCircle className="w-4 h-4" /> Make Donation (MD)
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Positions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' }}
              >
                <Layers className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700">
                In Queue
              </span>
            </div>
            <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.5px]">Active Positions</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              {kpiData.totalActivePositions} Position
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
            <span>Available Pins:</span>
            <strong className="text-slate-800">{kpiData.availablePinsCount} Ready</strong>
          </div>
        </div>

        {/* Card 2: Total in Queue */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}
              >
                <Zap className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700">
                Committed
              </span>
            </div>
            <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.5px]">Total In Queue</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${kpiData.totalLendAmountInQueue.toFixed(2)}
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
            <span>Protocol:</span>
            <strong className="text-[#10b981]">2:1 FIFO Engine</strong>
          </div>
        </div>

        {/* Card 3: Expected 162% Payout */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700">
                162% Return
              </span>
            </div>
            <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.5px]">Expected Payout</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 my-1">
              ${kpiData.totalTargetReturnInQueue.toFixed(2)}
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
            <span>Received:</span>
            <strong className="text-amber-600">${kpiData.totalReceivedInQueue.toFixed(2)}</strong>
          </div>
        </div>

        {/* Card 4: Best Queue Rank */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          style={{ borderLeft: '4px solid #10b981' }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}
              >
                <Flag className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-emerald-600 text-white">
                Next in Line
              </span>
            </div>
            <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.5px]">Closest Queue Rank</div>
            <div className="text-xl sm:text-2xl font-black text-[#10b981] my-1">
              #1 Next in Line
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
            <span>Status:</span>
            <strong className="text-[#10b981]">Ready for next donor</strong>
          </div>
        </div>
      </div>

      {/* USER ACTIVE QUEUE POSITIONS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e3228] text-white flex items-center justify-center font-bold">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-0">Your Active Queue Positions</h2>
              <p className="text-xs text-slate-500">Live status, donors received, and progress to 162% completion</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
            {activeLogs.length} Active Position(s) Shown
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeLogs.map((log) => {
              const receivedCount = log.donorsReceivedCount;
              const progressPercent = receivedCount >= 2 ? 100 : receivedCount === 1 ? 50 : 10;
              const ahead = log.donorsAhead;
              const targetPayout = log.targetReturn;

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm relative space-y-4"
                  style={{ borderLeft: `5px solid ${ahead === 0 ? '#10b981' : '#3b82f6'}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 text-white">
                          Position #{log.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          Ref: {log.referenceNo}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{log.packageName}</h3>
                      <span className="text-xs text-slate-500">
                        Lend Amount: <strong className="text-slate-800">${log.lendAmount.toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm inline-flex items-center gap-1 ${ahead === 0 ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                        <Flag className="w-3 h-3" />
                        {ahead === 0 ? 'Next in Line (#1)' : `#${log.queuePosition} in Queue`}
                      </div>
                      <div className="mt-1 text-[11px]">
                        {ahead === 0 ? (
                          <span className="text-[#10b981] font-bold flex items-center justify-end gap-1">
                            <Zap className="w-3 h-3" /> Ready for next donor
                          </span>
                        ) : (
                          <span className="text-slate-500"><strong>{ahead}</strong> positions ahead</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="font-semibold text-slate-600">
                        Matched: <strong className="text-slate-900">{receivedCount}/2 Donors</strong>
                      </span>
                      <span className={`font-bold ${receivedCount === 1 ? 'text-blue-600' : receivedCount >= 2 ? 'text-emerald-600' : 'text-slate-500'}`}>
                        ${log.receivedAmount.toFixed(2)} / ${targetPayout.toFixed(2)} (162%)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${receivedCount >= 1 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Start (0%)</span>
                      <span>1st: 81% (${(log.lendAmount * 0.81).toFixed(2)})</span>
                      <span>2nd: 162% (${targetPayout.toFixed(2)})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Activated: {log.createdAt}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      receivedCount >= 2 ? 'bg-emerald-100 text-emerald-800' :
                      receivedCount === 1 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {receivedCount >= 2 ? '✓ Ready for Recommitment' : receivedCount === 1 ? '1/2 Received — 1 More Needed' : 'Waiting for 1st Donor'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOW 2:1 FIFO QUEUE MATCHING WORKS */}
      <div
        className="rounded-3xl p-6 sm:p-7 text-white shadow-xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e3228 0%, #0a251e 100%)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">How the 2:1 FIFO Matching Protocol Works</h2>
        </div>
        <p className="text-xs sm:text-[13px] text-white/60 mb-5 leading-relaxed">
          Fair, fully transparent, automated queue progression designed for sustainable community growth.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div
            className="p-4 rounded-2xl h-full space-y-2"
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Request Donation</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Donate using Donate or Commission Wallet + 1x package-tied Credit. Your position is recorded in the FIFO line.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl h-full space-y-2"
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Transparent Line</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Track your live position in queue. As earlier donors are paired, you advance sequentially to position #1.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl h-full space-y-2"
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              3
            </div>
            <h3 className="font-bold text-white text-sm">2x 81% Paired Return</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Once at #1, the engine pairs two community donors directly into your cycle (81% + 81% = 162% total return).
            </p>
          </div>

          <div
            className="p-4 rounded-2xl h-full space-y-2"
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Recommit & Unlock</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Recommit principal capital back into the queue to instantly release your 62% surplus profit to your withdrawable wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQueueTrackerPage;
