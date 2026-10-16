import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Key,
  Search,
  ExternalLink,
  
  Building2,
  Wallet,
  Bitcoin
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  orderNumber: number;
  packageTitle: string;
  creditsCount: number;
  amount: number;
  paymentMethod: string;
  methodType: 'deposit' | 'crypto' | 'commission';
  txHash: string;
  status: 'Completed' | 'Processing';
  dateTime: string;
}

export const UserPurchasedEpinsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const purchases: PurchaseOrder[] = [
    {
      id: '#ORD-00105',
      orderNumber: 105,
      packageTitle: 'Starter Support Package',
      creditsCount: 2,
      amount: 20.0,
      paymentMethod: 'Donate Wallet',
      methodType: 'deposit',
      txHash: '0x8f7d6a4c2e1b9f8a3d5e7c6b4a2f1e9d8c7b6a5e',
      status: 'Completed',
      dateTime: '12 Oct 2026, 04:30 PM'
    },
    {
      id: '#ORD-00084',
      orderNumber: 84,
      packageTitle: 'Community Micro Seed',
      creditsCount: 1,
      amount: 5.0,
      paymentMethod: 'USDT (BEP-20)',
      methodType: 'crypto',
      txHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      status: 'Completed',
      dateTime: '08 Oct 2026, 11:15 AM'
    },
    {
      id: '#ORD-00052',
      orderNumber: 52,
      packageTitle: 'Starter Support Package',
      creditsCount: 1,
      amount: 10.0,
      paymentMethod: 'Donate Wallet',
      methodType: 'deposit',
      txHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d',
      status: 'Completed',
      dateTime: '29 Sep 2026, 09:15 AM'
    },
    {
      id: '#ORD-00019',
      orderNumber: 19,
      packageTitle: 'Growth Builder Tier',
      creditsCount: 2,
      amount: 50.0,
      paymentMethod: 'USDT (BEP-20)',
      methodType: 'crypto',
      txHash: '0x1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e',
      status: 'Completed',
      dateTime: '15 Sep 2026, 02:20 PM'
    }
  ];

  const filtered = purchases.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.txHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPurchasedPins = purchases.reduce((acc, curr) => acc + curr.creditsCount, 0);
  const totalSpent = purchases.reduce((acc, curr) => acc + curr.amount, 0);
  const activePins = 4;

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs matching my_purchased.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            Purchased Credits Orders
          </h4>
          <span className="text-xs sm:text-sm text-slate-500">
            Complete transaction log of your purchased Credit packages with blockchain hash
            verification
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/user/buy-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e3228] hover:bg-[#154639] text-white text-xs font-bold transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Buy Credits
          </Link>
          <Link
            to="/user/my-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Key className="w-4 h-4 text-slate-500" /> View Credit Vault
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Summary Cards matching my_purchased.blade.php */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Credits Purchased (Orange border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#ff7a1a]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Total Credits Purchased
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPurchasedPins} Credits</div>
          <small className="text-xs text-slate-400">Lifetime purchased via Web3 &amp; wallets</small>
        </div>

        {/* Card 2: Total Capital Spent (Green border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#16a34a]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Total Capital Spent
          </div>
          <div className="text-2xl font-black text-emerald-600">${totalSpent.toFixed(2)}</div>
          <small className="text-xs text-slate-400">Directly invested in Credits packages</small>
        </div>

        {/* Card 3: Available Active Credits (Sky Blue border-left) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs border-l-4 border-l-[#0284c7]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Available Active Credits
          </div>
          <div className="text-2xl font-black text-blue-600">{activePins} Ready</div>
          <small className="text-xs text-slate-400">Ready to donate or transfer</small>
        </div>
      </div>

      {/* Filter & Table Card matching rep-table-card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <h6 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Credit Package Purchase Orders
          </h6>

          <div className="flex items-center gap-3">
            <div className="relative w-64 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Order # or Receipt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Credits Count</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Transaction Hash / Receipt</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const shortHash =
                  p.txHash.length > 16
                    ? `${p.txHash.substring(0, 8)}...${p.txHash.substring(p.txHash.length - 6)}`
                    : p.txHash;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{p.id}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{p.packageTitle}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white">
                        {p.creditsCount} Credits
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900 text-sm">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      {p.methodType === 'deposit' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          {p.paymentMethod}
                        </span>
                      )}
                      {p.methodType === 'crypto' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
                          <Bitcoin className="w-3.5 h-3.5 text-amber-600" />
                          {p.paymentMethod}
                        </span>
                      )}
                      {p.methodType === 'commission' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          {p.paymentMethod}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={`https://bscscan.com/tx/${p.txHash}`}
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {p.dateTime}
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
