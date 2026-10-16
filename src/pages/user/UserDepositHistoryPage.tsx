import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  ExternalLink
} from 'lucide-react';

export const UserDepositHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const deposits = [
    { id: 'DEP#5019', txHash: '0x9a8f4c2e1b7d3a5e8f2c4b6d8e0a2c4e6a8b0d2f', amount: 100.00, method: 'USDT BEP-20', status: 'Approved', date: 'Oct 11, 2026 02:20 PM' },
    { id: 'DEP#4822', txHash: '0x7e5b3c1a9f8d6e4b2a0c8e6a4b2d0e8f6c4a2b0d', amount: 200.00, method: 'USDT BEP-20', status: 'Approved', date: 'Oct 05, 2026 11:45 AM' },
    { id: 'DEP#4510', txHash: '0x3c2a1b0e9f8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c', amount: 50.00, method: 'USDT BEP-20', status: 'Approved', date: 'Sep 28, 2026 04:10 PM' }
  ];

  const totalDeposited = deposits.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredDeposits = deposits.filter((dep) => {
    const matchesSearch = dep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dep.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || dep.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <span className="text-slate-900 font-bold">Donate History</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">Donate History Log</h1>
          <p className="text-xs text-slate-500">Record of verified on-chain deposits into your Donate Wallet.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/user/deposit-fund"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Funds
          </Link>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            Total Deposited: <strong className="text-slate-900">${totalDeposited.toFixed(2)} USDT</strong>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Reference or Tx Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Status:</span>
            {['ALL', 'APPROVED', 'PENDING'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Reference ID</th>
                <th className="px-4 py-3.5">Tx Hash</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-800">{dep.id}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500 max-w-[180px] truncate" title={dep.txHash}>
                    {dep.txHash.slice(0, 8)}...{dep.txHash.slice(-6)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-black text-emerald-600">
                    +${dep.amount.toFixed(2)} USDT
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                      {dep.method}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {dep.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{dep.date}</td>
                  <td className="px-4 py-3.5 text-right">
                    <a
                      href={`https://bscscan.com/tx/${dep.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      BscScan <ExternalLink className="w-3 h-3" />
                    </a>
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
export default UserDepositHistoryPage;
