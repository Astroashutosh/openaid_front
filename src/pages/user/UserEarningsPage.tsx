import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Network,
  RotateCcw,
  FileSpreadsheet,
  Search,
  ListCheck,
  Receipt
} from 'lucide-react';

interface Props {
  initialTab?: 'referral' | 'level' | 'donation' | 'transactions' | 'company';
}

export const UserEarningsPage: React.FC<Props> = ({ initialTab = 'transactions' }) => {
  const location = useLocation();

  // Infer tab from URL if available
  const getTabFromPath = () => {
    if (location.pathname.includes('referral-income')) return 'referral';
    if (location.pathname.includes('level-income')) return 'level';
    if (location.pathname.includes('donation-earnings')) return 'donation';
    if (location.pathname.includes('company-commission')) return 'company';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<'referral' | 'level' | 'donation' | 'transactions' | 'company'>(getTabFromPath());
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Referral Income Data (8%)
  const referralLogs = [
    { id: 'REF-8012', fromUser: 'alex_crypto', fromName: 'Alex Johnson', package: 'Starter Support ($100)', percentage: '8.00%', amount: 8.00, newBalance: 245.50, date: 'Oct 12, 2026 02:40 PM' },
    { id: 'REF-7940', fromUser: 'sarah_c', fromName: 'Sarah Connor', package: 'Growth Helping Tier ($200)', percentage: '8.00%', amount: 16.00, newBalance: 237.50, date: 'Oct 10, 2026 11:15 AM' },
    { id: 'REF-7801', fromUser: 'david_m', fromName: 'David Miller', package: 'Community Micro Seed ($50)', percentage: '8.00%', amount: 4.00, newBalance: 221.50, date: 'Oct 04, 2026 06:20 PM' }
  ];

  // 2. Level Team Income Data (8-levels)
  const levelLogs = [
    { id: 'LVL-5102', fromUser: 'kyle_reese', fromName: 'Kyle Reese', level: 'Level 2', percentage: '2.00%', packageAmount: 100.00, amount: 2.00, newBalance: 217.50, date: 'Oct 11, 2026 05:10 PM' },
    { id: 'LVL-5044', fromUser: 'grace_hopper', fromName: 'Grace Hopper', level: 'Level 2', percentage: '2.00%', packageAmount: 200.00, amount: 4.00, newBalance: 215.50, date: 'Oct 09, 2026 04:05 PM' },
    { id: 'LVL-4921', fromUser: 'elena_r', fromName: 'Elena Rostova', level: 'Level 3', percentage: '2.00%', packageAmount: 50.00, amount: 1.00, newBalance: 211.50, date: 'Oct 03, 2026 01:30 PM' }
  ];

  // 3. FIFO Donation Growth (162%)
  const donationLogs = [
    { id: 'DON-104', queuePos: '#104', donors: 'crypto_dan, lisa_web3', lendAmount: 100.00, received: 162.00, newBalance: 312.50, surplus: 62.00, date: 'Oct 08, 2026 11:15 AM', status: 'Completed' },
    { id: 'DON-101', queuePos: '#101', donors: 'mark_invest, sarah_c', lendAmount: 50.00, received: 81.00, newBalance: 150.50, surplus: 31.00, date: 'Sep 25, 2026 02:00 PM', status: 'Completed' }
  ];

  // 4. All Transactions Ledger
  const transactions = [
    { id: 'TX#9021', type: 'Referral Bonus', desc: 'Direct sponsor commission from alex_crypto', amount: 8.00, balanceAfter: 245.50, date: 'Oct 12, 2026 02:40 PM' },
    { id: 'TX#8994', type: 'Donation Payout', desc: 'FIFO 162% cycle payout (81% match received)', amount: 81.00, balanceAfter: 237.50, date: 'Oct 11, 2026 06:15 PM' },
    { id: 'TX#8820', type: 'Withdrawal', desc: 'USDT BEP-20 withdrawal cashout to external wallet', amount: -150.00, balanceAfter: 156.50, date: 'Oct 10, 2026 11:20 AM' },
    { id: 'TX#8741', type: 'Level Bonus', desc: 'Level 2 team bonus (2.00%) from downline trade', amount: 4.00, balanceAfter: 306.50, date: 'Oct 09, 2026 04:05 PM' },
    { id: 'TX#8650', type: 'Credit Purchase', desc: 'Package activation credit purchase (1x $100 Tier)', amount: -10.00, balanceAfter: 302.50, date: 'Oct 08, 2026 01:10 PM' },
    { id: 'TX#8512', type: 'Rank Reward', desc: 'Starter rank qualification cash milestone award', amount: 50.00, balanceAfter: 312.50, date: 'Oct 05, 2026 09:30 AM' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <Link to="/user/my-wallet" className="hover:text-emerald-700">My Wallet</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Earnings & Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Financial Reports & Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time reports for 8% direct referrals, 8-level commissions, FIFO 162% returns, and full transaction history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Exporting report to Excel spreadsheet...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-[#0c2c23] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" /> All Transactions Ledger
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'referral'
              ? 'bg-[#0c2c23] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Direct Referral Income (8%)
        </button>
        <button
          onClick={() => setActiveTab('level')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'level'
              ? 'bg-[#0c2c23] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Network className="w-3.5 h-3.5" /> Level Team Commission (19%)
        </button>
        <button
          onClick={() => setActiveTab('donation')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'donation'
              ? 'bg-[#0c2c23] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" /> FIFO Donation Growth (162%)
        </button>
      </div>

      {/* TAB 1: ALL TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Transaction ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/20"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold">{transactions.length} Ledger Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5 text-right">Balance After</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => {
                    const isCredit = tx.amount >= 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5 font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                            {tx.id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-medium max-w-sm truncate">{tx.desc}</td>
                        <td className="px-4 py-3.5 text-right font-bold">
                          <span className={isCredit ? 'text-emerald-600' : 'text-rose-600'}>
                            {isCredit ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-800">
                          ${tx.balanceAfter.toFixed(2)}
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{tx.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT REFERRAL INCOME (matching referral_income.blade.php) */}
      {activeTab === 'referral' && (
        <div className="space-y-4">
          {/* Top Metric Summary Cards from referral_income.blade.php */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #16a34a' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Total Referral Earnings
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">+$420.00</div>
              <small className="text-xs text-slate-400">Lifetime 8% direct bonuses</small>
            </div>

            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #ff7a1a' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Direct Referrals Team
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">4 Members</div>
              <small className="text-xs text-slate-400">Registered with your sponsor link</small>
            </div>

            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #0284c7' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Active Donors in Directs
              </div>
              <div className="text-2xl font-bold text-sky-600 font-mono">3 Active</div>
              <small className="text-xs text-slate-400">Currently in FIFO cycle queue</small>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListCheck className="w-4 h-4 text-amber-500" /> Referral Commission Ledger
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                {referralLogs.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">From Contributor</th>
                    <th className="px-4 py-3.5">Package</th>
                    <th className="px-4 py-3.5 text-center">Rate</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5 text-right">Balance</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referralLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-blue-600">#{log.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800">
                          <span className="w-5 h-5 rounded-full bg-[#ff7a1a] text-white flex items-center justify-center text-[10px] font-bold">
                            {log.fromUser.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <div>{log.fromUser}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">{log.package}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                          {log.percentage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                        +${log.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700">
                        ${log.newBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEVEL TEAM COMMISSION (matching level_income.blade.php) */}
      {activeTab === 'level' && (
        <div className="space-y-4">
          {/* Top Metric Summary Cards from level_income.blade.php */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #0e3228' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Total Level Commissions
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">+$380.75</div>
              <small className="text-xs text-slate-400">Accumulated from 7 community tiers</small>
            </div>

            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #ff7a1a' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Total Payout Transactions
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">24 Credits</div>
              <small className="text-xs text-slate-400">Directly deposited to commission wallet</small>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-500" /> Level Earnings Records
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                7 Tiers Distributed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">From Contributor</th>
                    <th className="px-4 py-3.5">Tier Level</th>
                    <th className="px-4 py-3.5 text-center">Rate</th>
                    <th className="px-4 py-3.5 text-right">Commission Amount</th>
                    <th className="px-4 py-3.5 text-right">Balance</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-blue-600">#{log.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {log.fromUser.charAt(0).toUpperCase()}
                          </span>
                          <div>{log.fromUser}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0e3228]/10 text-[#0e3228]">
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-700">{log.percentage}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                        +${log.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700">
                        ${log.newBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FIFO DONATION GROWTH (matching donation_earnings.blade.php) */}
      {activeTab === 'donation' && (
        <div className="space-y-4">
          {/* Top Metric Summary Cards from donation_earnings.blade.php */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #16a34a' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Total Payouts Received
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">+$950.00</div>
              <small className="text-xs text-slate-400">Total 162% return funds credited</small>
            </div>

            <div
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80"
              style={{ borderLeft: '4px solid #ff7a1a' }}
            >
              <div className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-500 mb-1">
                Completed 2:1 Receiver Cycles
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">2 Cycles Completed</div>
              <small className="text-xs text-slate-400">Fully matched with 2 incoming community donors</small>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" /> 162% FIFO Payout Ledger
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                162% Payout Multiplier
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">Queue Position</th>
                    <th className="px-4 py-3.5">Matched Donors</th>
                    <th className="px-4 py-3.5 text-right">Lend Amount</th>
                    <th className="px-4 py-3.5 text-right">Payout Received (162%)</th>
                    <th className="px-4 py-3.5 text-right">Balance</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-blue-600">#{log.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{log.queuePos}</td>
                      <td className="px-4 py-3.5 text-slate-600">{log.donors}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-700">${log.lendAmount.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-black text-emerald-600">
                        +${log.received.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700">
                        ${log.newBalance.toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEarningsPage;
