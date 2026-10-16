import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Search,
  ExternalLink,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const UserWithdrawReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const availableBalance = 245.50;

  const withdrawals = [
    {
      id: '1092',
      grossAmount: 150.00,
      fee: 3.00,
      feePercent: 2,
      netAmount: 147.00,
      payoutWallet: '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57',
      sourceWallet: 'Main',
      txHash: '0x4f1a8c9b2d3e5f7a1b0c9d8e7f6a5b4c3d2e1f0a',
      status: 'approved',
      date: '10 Oct 2026, 11:20 AM'
    },
    {
      id: '0984',
      grossAmount: 100.00,
      fee: 2.00,
      feePercent: 2,
      netAmount: 98.00,
      payoutWallet: '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57',
      sourceWallet: 'Donation',
      txHash: '0x7e2d9b1c4a5f6e8a0b2c4d6f8e0a2b4c6e8a0d2f',
      status: 'approved',
      date: '02 Oct 2026, 03:45 PM'
    },
    {
      id: '0812',
      grossAmount: 50.00,
      fee: 1.00,
      feePercent: 2,
      netAmount: 49.00,
      payoutWallet: '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57',
      sourceWallet: 'Main',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      status: 'approved',
      date: '21 Sep 2026, 09:10 AM'
    }
  ];

  const filtered = withdrawals.filter((w) => {
    return w.id.includes(searchTerm) ||
           w.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
           w.payoutWallet.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <Link to="/user/my-wallet" className="hover:text-emerald-700">My Wallet</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Withdrawal History</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-0">Withdrawal History</h1>
        </div>

        <Link
          to="/user/withdraw-usdt"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm text-slate-950 transition-all hover:opacity-95"
          style={{ background: '#FF7A1A', color: '#fff' }}
        >
          <ArrowUpRight className="w-4 h-4" /> New Withdrawal
        </Link>
      </div>

      {/* Main Table Card (matching wd-table-card in blade) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 mb-0">Recent Withdrawal Requests</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              {withdrawals.length} Total
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Currency: <strong>USDT (BEP-20)</strong> • Available Balance: <strong className="text-slate-900">${availableBalance.toFixed(2)}</strong>
          </div>
        </div>

        {/* Filter input */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID or Tx Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/20 focus:border-[#FF7A1A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5">Transaction</th>
                <th className="px-4 py-3.5 text-right">Gross Amount</th>
                <th className="px-4 py-3.5 text-right">Fee (2%)</th>
                <th className="px-4 py-3.5 text-right">Net Receivable</th>
                <th className="px-4 py-3.5">Payout Wallet (BEP-20)</th>
                <th className="px-4 py-3.5">Withdraw Wallet</th>
                <th className="px-4 py-3.5">Tx Hash</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255, 122, 26, 0.1)', color: '#ff7a1a' }}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-900 text-[13px]">
                          #{item.id}
                        </div>
                        <small className="text-slate-400 block text-[11px]">
                          {item.date}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 text-[13.5px]">
                    ${item.grossAmount.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-rose-600 font-semibold text-[12.5px]">
                    -${item.fee.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <span className="font-mono font-bold text-emerald-600 text-[14px]">
                      ${item.netAmount.toFixed(2)}{' '}
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">USDT</span>
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 font-mono text-blue-600 font-bold text-xs">
                      {item.payoutWallet.slice(0, 6)}...{item.payoutWallet.slice(-4)}
                      <a
                        href={`https://bscscan.com/address/${item.payoutWallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600 ml-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.sourceWallet}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 font-mono text-slate-900 font-bold text-[11.5px]">
                      {item.txHash.slice(0, 6)}...{item.txHash.slice(-4)}
                      <a
                        href={`https://bscscan.com/tx/${item.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[#FF7A1A]" /> Withdrawal Details #{selectedTx.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gross Amount Requested:</span>
                <strong className="text-slate-900">${selectedTx.grossAmount.toFixed(2)} USDT</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Protocol Fee ({selectedTx.feePercent}%):</span>
                <strong className="text-rose-600">-${selectedTx.fee.toFixed(2)} USDT</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Net Dispatched Amount:</span>
                <strong className="text-emerald-600 font-bold">${selectedTx.netAmount.toFixed(2)} USDT</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payout Wallet (BEP-20):</span>
                <span className="font-mono text-blue-600">{selectedTx.payoutWallet}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Transaction Hash:</span>
                <span className="font-mono text-slate-800 break-all">{selectedTx.txHash}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  Approved & Dispatched
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Requested Date:</span>
                <span className="text-slate-800">{selectedTx.date}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWithdrawReportPage;
