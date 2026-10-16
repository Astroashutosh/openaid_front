import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Users,
  RotateCcw,
  PlusCircle,
  Layers,
  UserCheck
} from 'lucide-react';

export const UserReceiveDonationPage: React.FC = () => {
  const stats = {
    totalDonated: 300.00,
    activePositions: 1,
    totalReceived: 243.00,
    completedPositions: 2,
    totalPositionsCount: 3,
    matchedDonorsCount: 3
  };

  const queueEntries = [
    {
      id: 105,
      packageName: 'Starter Support Package ($100)',
      donated: 100.00,
      targetReturn: 162.00,
      receivedAmount: 81.00,
      donorsCount: 1,
      status: 'active',
      date: 'Oct 11, 2026',
      time: '04:30 PM'
    },
    {
      id: 104,
      packageName: 'Starter Support Package ($100)',
      donated: 100.00,
      targetReturn: 162.00,
      receivedAmount: 162.00,
      donorsCount: 2,
      status: 'completed',
      date: 'Oct 08, 2026',
      time: '11:15 AM'
    },
    {
      id: 101,
      packageName: 'Community Micro Seed ($50)',
      donated: 50.00,
      targetReturn: 81.00,
      receivedAmount: 81.00,
      donorsCount: 2,
      status: 'completed',
      date: 'Sep 25, 2026',
      time: '02:00 PM'
    }
  ];

  const incomingMatches = [
    {
      id: 'REF-001092',
      senderUsername: 'crypto_dan',
      senderName: 'Daniel Vance',
      receiverLogId: 'POS-00105',
      amount: 81.00,
      paymentMethod: 'Web3 USDT BEP-20',
      txHash: '0x8f2d...4a1b',
      confirmedAt: 'Oct 12, 2026, 10:14 AM'
    },
    {
      id: 'REF-001048',
      senderUsername: 'lisa_web3',
      senderName: 'Lisa Miller',
      receiverLogId: 'POS-00104',
      amount: 81.00,
      paymentMethod: 'Earning Wallet',
      txHash: '',
      confirmedAt: 'Oct 09, 2026, 05:40 PM'
    },
    {
      id: 'REF-001041',
      senderUsername: 'mark_invest',
      senderName: 'Mark Chen',
      receiverLogId: 'POS-00104',
      amount: 81.00,
      paymentMethod: 'Web3 USDT BEP-20',
      txHash: '0x3a4b...9e10',
      confirmedAt: 'Oct 08, 2026, 09:12 AM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Sequential FIFO Matching Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Receive Donation (RD)</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Live tracker of incoming peer donations matched to your FIFO queue positions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/user/recommitment"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" /> Recommitment Protocol
          </Link>
          <Link
            to="/user/make-donation"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-700/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Request New Donation ($100)
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donated */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              Help Given
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Donated (MD)</div>
          <div className="text-2xl font-black text-slate-900 my-1">${stats.totalDonated.toFixed(2)}</div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active In Queue:</span>
            <strong className="text-emerald-600">{stats.activePositions} Position</strong>
          </div>
        </div>

        {/* Total Received */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700">
              Help Received
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received (RD)</div>
          <div className="text-2xl font-black text-slate-900 my-1">${stats.totalReceived.toFixed(2)}</div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Target Return:</span>
            <strong className="text-sky-600">162% P2P Payout</strong>
          </div>
        </div>

        {/* Completed Cycles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
              Finished
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Cycles</div>
          <div className="text-2xl font-black text-slate-900 my-1">{stats.completedPositions}</div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rounds Cleared:</span>
            <strong className="text-slate-800">{stats.completedPositions} of {stats.totalPositionsCount}</strong>
          </div>
        </div>

        {/* Matched Donors Count */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
              Matched Donors
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Incoming Donors</div>
          <div className="text-2xl font-black text-slate-900 my-1">{stats.matchedDonorsCount}</div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Direct P2P Donors:</span>
            <strong className="text-purple-600">{stats.matchedDonorsCount} Matched</strong>
          </div>
        </div>
      </div>

      {/* 2:1 FIFO Explainer Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0f392b 0%, #155e46 60%, #10b981 100%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                2:1 MATCHING RULE
              </span>
              <span className="text-xs text-emerald-200">• FIFO Sequential Priority</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">How You Receive $162 on Every $100 Donation</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              When your position reaches the front of the queue, the platform's Sequential FIFO algorithm pairs <strong>2 incoming peer donors</strong> directly to your position (2x 81% = $81 + $81 = $162 total). Once 2 donors are matched, the cycle completes and your $162 return is instantly credited to your wallet.
            </p>
          </div>

          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 min-w-[170px] self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Return Multiplier</span>
            <span className="text-3xl font-black text-amber-300 block">162%</span>
            <span className="text-[11px] text-emerald-200">2x 81% Per Cycle</span>
          </div>
        </div>
      </div>

      {/* Section 1: Your FIFO Queue Positions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Your FIFO Queue Positions
            </h3>
            <p className="text-xs text-slate-500">Track your position queue status and live donor matching progress.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            {queueEntries.length} Total Positions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Position</th>
                <th className="px-4 py-3.5">Donated Capital</th>
                <th className="px-4 py-3.5">Target Payout (162%)</th>
                <th className="px-4 py-3.5 min-w-[220px]">Donors Progress (2:1)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5">Date Queued</th>
                <th className="px-6 py-3.5 text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueEntries.map((pos) => {
                const progressPct = (pos.donorsCount / 2) * 100;
                return (
                  <tr key={pos.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          pos.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          #{pos.id}
                        </div>
                        <div>
                          <strong className="text-slate-900 text-xs sm:text-sm block">{pos.packageName}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">POS-{String(pos.id).padStart(5, '0')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">${pos.donated.toFixed(2)}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-sky-600 block">${pos.targetReturn.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">162% Payout</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-semibold ${pos.donorsCount === 2 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {pos.donorsCount === 2 ? '✓ 2 of 2 Donors Matched' :
                           pos.donorsCount === 1 ? '⏳ 1 of 2 Donors Matched' : 'Waiting in Queue (0/2)'}
                        </span>
                        <span className="font-bold text-slate-700">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pos.donorsCount === 2 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pos.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {pos.status === 'completed' ? 'Completed' : 'Active in Queue'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      <div>{pos.date}</div>
                      <div className="text-[10px] text-slate-400">{pos.time}</div>
                    </td>
                    <td className="px-6 py-3.5 text-right font-black text-emerald-600">
                      +${pos.receivedAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Confirmed Incoming Matched Donors */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600" /> Confirmed Incoming Matched Donors
            </h3>
            <p className="text-xs text-slate-500">Individual peer donors matched to your queue positions via the Sequential FIFO algorithm.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700">
            {incomingMatches.length} Direct Matches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Match Ref</th>
                <th className="px-4 py-3.5">Donor Member</th>
                <th className="px-4 py-3.5">Assigned Position</th>
                <th className="px-4 py-3.5 text-right">Matched Amount</th>
                <th className="px-4 py-3.5">Payment Route</th>
                <th className="px-4 py-3.5">Matched At</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomingMatches.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-700">{m.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
                        {m.senderUsername.slice(0, 2)}
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs block">{m.senderUsername}</strong>
                        <span className="text-[10px] text-slate-400">{m.senderName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs">
                      {m.receiverLogId}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-black text-emerald-600">
                    +${m.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                    {m.paymentMethod}
                    {m.txHash && <span className="block text-[10px] text-slate-400 font-mono">{m.txHash}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">{m.confirmedAt}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed & Paid
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
export default UserReceiveDonationPage;
