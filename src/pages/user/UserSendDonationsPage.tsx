import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  ExternalLink,
  Building2,
  Wallet,
  Bitcoin
} from 'lucide-react';

interface SentDonation {
  id: string;
  packageTitle: string;
  amount: number;
  paymentMethod: string;
  methodType: 'deposit' | 'crypto' | 'commission';
  txHash: string;
  donorsMatched: number; // 0, 1, or 2
  targetPayout: number;
  status: 'Active In Queue' | 'Cycle Completed (162%)';
  dateTime: string;
}

export const UserSendDonationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const donations: SentDonation[] = [
    {
      id: '#POS-00105',
      packageTitle: 'Starter Support Package',
      amount: 100.0,
      paymentMethod: 'Donate Wallet',
      methodType: 'deposit',
      txHash: '0x8f7d6a4c2e1b9f8a3d5e7c6b4a2f1e9d8c7b6a5e',
      donorsMatched: 1,
      targetPayout: 162.0,
      status: 'Active In Queue',
      dateTime: '11 Oct 2026, 04:30 PM'
    },
    {
      id: '#POS-00104',
      packageTitle: 'Starter Support Package',
      amount: 100.0,
      paymentMethod: 'Donate Wallet',
      methodType: 'deposit',
      txHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      donorsMatched: 2,
      targetPayout: 162.0,
      status: 'Cycle Completed (162%)',
      dateTime: '08 Oct 2026, 11:15 AM'
    },
    {
      id: '#POS-00101',
      packageTitle: 'Community Micro Seed',
      amount: 50.0,
      paymentMethod: 'USDT (BEP-20)',
      methodType: 'crypto',
      txHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d',
      donorsMatched: 2,
      targetPayout: 81.0,
      status: 'Cycle Completed (162%)',
      dateTime: '25 Sep 2026, 02:00 PM'
    }
  ];

  const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);
  const activeDonations = donations.filter((d) => d.status === 'Active In Queue').length;
  const completedDonations = donations.filter((d) => d.status === 'Cycle Completed (162%)').length;

  const filtered = donations.filter(
    (d) =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.txHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs matching send_donations.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            Sent Donations
          </h4>
          <span className="text-xs sm:text-sm text-slate-500">
            All sent donations with payment method, blockchain tx hash verification, and 2:1 FIFO cycle matching progress
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/user/make-donation"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-xs"
          >
            <ArrowUpCircle className="w-4 h-4" /> Make New Donation
          </Link>
          <Link
            to="/user/receive-donation"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <ArrowDownCircle className="w-4 h-4 text-slate-500" /> Receiver Queue
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Summary Cards matching send_donations.blade.php */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Help Sent (MD) (Green border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#16a34a]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Total Help Sent (MD)
          </div>
          <div className="text-2xl font-black text-emerald-600">${totalDonated.toFixed(2)}</div>
          <small className="text-xs text-slate-400">Lifetime capital committed into protocol</small>
        </div>

        {/* Card 2: Active Queue Positions (Orange border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#ff7a1a]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Active Queue Positions
          </div>
          <div className="text-2xl font-black text-slate-900">{activeDonations} Positions</div>
          <small className="text-xs text-slate-400">Currently waiting for FIFO matching</small>
        </div>

        {/* Card 3: Completed 162% Positions (Sky Blue border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#0284c7]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Completed 162% Positions
          </div>
          <div className="text-2xl font-black text-blue-600">{completedDonations} Completed</div>
          <small className="text-xs text-slate-400">Fully matched with 2 donors</small>
        </div>
      </div>

      {/* Filter & Table Card matching rep-table-card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <h6 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Sent Donations Tracking Ledger
          </h6>

          <div className="flex items-center gap-3">
            <div className="relative w-64 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Ref # or Tx Hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              {filtered.length} Records
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Reference / Position</th>
                <th className="px-4 py-3.5">Donation Package</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Transaction Hash / Receipt</th>
                <th className="px-4 py-3.5 text-center">FIFO 2:1 Progress</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => {
                const shortHash =
                  d.txHash.length > 16
                    ? `${d.txHash.substring(0, 8)}...${d.txHash.substring(d.txHash.length - 6)}`
                    : d.txHash;
                const progressPct = Math.round((d.donorsMatched / 2) * 100);

                return (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{d.id}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{d.packageTitle}</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900 text-sm">
                      ${d.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      {d.methodType === 'deposit' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          {d.paymentMethod}
                        </span>
                      )}
                      {d.methodType === 'crypto' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
                          <Bitcoin className="w-3.5 h-3.5 text-amber-600" />
                          {d.paymentMethod}
                        </span>
                      )}
                      {d.methodType === 'commission' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          {d.paymentMethod}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={`https://bscscan.com/tx/${d.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-semibold text-[#ff7a1a] bg-[#ff7a1a]/10 hover:bg-[#ff7a1a] hover:text-white border border-[#ff7a1a]/30 transition"
                        title="Verify on BscScan"
                      >
                        <span>{shortHash}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              progressPct === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          {d.donorsMatched}/2 Matched ({progressPct}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status.includes('Completed')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {d.dateTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
