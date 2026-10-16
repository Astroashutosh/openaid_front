import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  PlusCircle,
  Heart,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Copy,
  ExternalLink,
  RotateCcw,
  TrendingUp,
  Award,
  Users,
  Network,
  Search,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';

export const UserWalletPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const walletData = {
    availableBalance: 245.50,
    depositBalance: 150.00,
    donationWallet: 100.00,
    donationWithdrawable: 62.00,
    totalEarning: 1850.75,
    totalWithdrawn: 1200.00,
    pendingWithdraw: 0.00,
    activePins: 3,
    userWalletAddress: '0x8b329Fe470Db40b1Fa15Eb52b4EbE17429d20c57',
    currentRank: 'Starter',
    isActive: true,
    incomeStreams: {
      referralIncome: 420.00,
      levelIncome: 380.75,
      donationIncome: 950.00,
      rankRewardIncome: 100.00,
      companyCommission: 0.00,
    }
  };

  const recentTransactions = [
    { id: 'TX#9021', type: 'REFERRAL', desc: 'Direct sponsor commission from member alex_crypto', amount: 8.00, balanceAfter: 245.50, date: 'Oct 12, 2026 02:40 PM' },
    { id: 'TX#8994', type: 'DONATION', desc: 'FIFO 162% cycle payout (81% match received)', amount: 81.00, balanceAfter: 237.50, date: 'Oct 11, 2026 06:15 PM' },
    { id: 'TX#8820', type: 'WITHDRAW', desc: 'USDT BEP-20 withdrawal cashout to external wallet', amount: -150.00, balanceAfter: 156.50, date: 'Oct 10, 2026 11:20 AM' },
    { id: 'TX#8741', type: 'LEVEL', desc: 'Level 2 team bonus (2.00%) from downline trade', amount: 4.00, balanceAfter: 306.50, date: 'Oct 09, 2026 04:05 PM' },
    { id: 'TX#8650', type: 'EPIN', desc: 'Package activation credit purchase (1x $100 Tier)', amount: -10.00, balanceAfter: 302.50, date: 'Oct 08, 2026 01:10 PM' },
    { id: 'TX#8512', type: 'RANK', desc: 'Starter rank qualification cash milestone award', amount: 50.00, balanceAfter: 312.50, date: 'Oct 05, 2026 09:30 AM' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(walletData.userWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTransactions = recentTransactions.filter(tx => {
    const matchesSearch = tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-[13.5px]">
          <Link to="/user/dashboard" className="text-[#ff7a1a] hover:text-[#ea580c] font-bold flex items-center gap-1 transition-transform hover:-translate-x-0.5">
            ← Dashboard
          </Link>
          <span className="text-slate-400 font-semibold">/</span>
          <span className="text-[#0e2718] font-bold">My Wallet</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold bg-[#fff7ed] text-[#c2410c] border border-[#fdba74]">
            ⭐ {walletData.currentRank}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            Active Donor
          </span>
        </div>
      </div>

      {/* Main Wallet Hero Card */}
      <div
        className="relative overflow-hidden rounded-[20px] p-7 sm:p-8 text-white shadow-[0_15px_35px_rgba(0,0,0,0.35)] border border-white/10"
        style={{ background: 'linear-gradient(135deg, #0c2c23 0%, #0e3228 45%, #184236 100%)' }}
      >
        {/* Glow orbs matching old blade */}
        <div
          className="absolute -top-16 -right-10 w-72 h-72 rounded-full pointer-events-none filter blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(255, 122, 26, 0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-10 -left-8 w-64 h-64 rounded-full pointer-events-none filter blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Balance Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.08] text-white/85 text-[11px] font-bold uppercase tracking-[0.4px] border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Commission Wallet (Main Balance)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#ff7a1a]/15 text-[#ff9f43] text-[11px] font-bold border border-[#ff7a1a]/30">
                USDT (BEP-20)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#10b981]">$</span>
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {walletData.availableBalance.toFixed(2)}
              </span>
              <span className="text-base font-bold text-white/60 ml-1">USDT</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[12.5px] text-white/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> Available for Instant Cashout
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Usable for Donations & Credits
              </span>
            </div>

            {/* Fast Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                to="/user/withdraw-usdt"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-white font-bold text-[13.5px] shadow-[0_4px_14px_rgba(255,122,26,0.35)] transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #ff7a1a 0%, #e65c00 100%)' }}
              >
                <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
              </Link>
              <Link
                to="/user/deposit-fund"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-[13.5px] border border-white/20 transition-all hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" /> Donate Fund
              </Link>
              <Link
                to="/user/make-donation"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] font-bold text-[13.5px] border border-[#10b981]/30 transition-all hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4" /> Make Donation
              </Link>
              <Link
                to="/user/buy-epins"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-[13.5px] border border-white/20 transition-all hover:-translate-y-0.5"
              >
                <Ticket className="w-4 h-4" /> Buy Credits
              </Link>
            </div>
          </div>

          {/* Connected BEP-20 Wallet Address Box */}
          <div className="lg:col-span-5">
            <div className="bg-black/30 backdrop-blur-[10px] rounded-[14px] p-4 sm:p-5 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>Registered Payout Destination</span>
                </div>
                <Link to="/user/wallet-address" className="text-[#ff9f43] hover:underline text-xs font-semibold">
                  Update
                </Link>
              </div>

              <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2 border border-white/[0.08]">
                <code className="text-xs font-mono text-[#38bdf8] truncate pr-2">
                  {walletData.userWalletAddress}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-8 h-8 rounded-md bg-white/[0.08] hover:bg-[#ff7a1a] hover:border-[#ff7a1a] text-white flex items-center justify-center transition-all flex-shrink-0"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11.5px]">
                <span className="flex items-center gap-1 text-[#10b981] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified BEP-20 Network
                </span>
                <a
                  href={`https://bscscan.com/address/${walletData.userWalletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                >
                  BscScan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Helping Plan Wallets Grid */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#0e2718] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#ff7a1a]" /> 4 Core Account Wallets
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
            Comprehensive multi-wallet system as defined in the OpenAid Helping Plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Commission Wallet (Main Balance) */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '3px solid #10b981'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                Liquid / Cashout
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[#10b981] leading-tight mb-1.5">
              ${walletData.availableBalance.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Commission Wallet (Main)</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Earned from 8-level referral commissions & rank rewards. Available for instant withdrawal or donations.
            </p>
            <div
              className="mt-3 pt-2 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <Link to="/user/withdraw-usdt" className="text-[#10b981] font-bold hover:underline">
                Withdraw →
              </Link>
              <Link to="/user/transactions" className="text-white/65 hover:text-white">
                Ledger
              </Link>
            </div>
          </div>

          {/* 2. Donate Wallet */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '3px solid #ff7a1a'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(255, 122, 26, 0.15)', color: '#ff7a1a' }}
              >
                <PlusCircle className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(255, 122, 26, 0.15)', color: '#ff9f43' }}
              >
                On-Chain Donate
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[#ff7a1a] leading-tight mb-1.5">
              ${walletData.depositBalance.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Donate Wallet</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Funded via verified USDT (BEP-20) blockchain Donate. Used for package donations and Credit purchases.
            </p>
            <div
              className="mt-3 pt-2 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <Link to="/user/deposit-fund" className="text-[#ff7a1a] font-bold hover:underline">
                + Donate Fund
              </Link>
              <Link to="/user/make-donation" className="text-white/65 hover:text-white">
                Donate
              </Link>
            </div>
          </div>

          {/* 3. Redonation Wallet */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '3px solid #f59e0b'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                <RotateCcw className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                Recommit Capital
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[#f59e0b] leading-tight mb-1.5">
              ${walletData.donationWallet.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Redonation Wallet</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Preserves 100% principal capital from completed 162% cycles. Reserved for recommitment back into queue.
            </p>
            <div
              className="mt-3 pt-2 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <Link to="/user/recommitment" className="text-[#f59e0b] font-bold hover:underline">
                Recommit Now →
              </Link>
              <span className="text-white/65 font-medium text-[11.5px]">100% Capital</span>
            </div>
          </div>

          {/* 4. Withdrawable Cycle Profit */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '3px solid #38bdf8'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                +62% Unlocked
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-[#38bdf8] leading-tight mb-1.5">
              ${walletData.donationWithdrawable.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Withdrawable Cycle Profit</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Surplus +62% profit unlocked upon recommitment. Liquid funds available for immediate withdrawal.
            </p>
            <div
              className="mt-3 pt-2 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <Link to="/user/withdraw-usdt" className="text-[#38bdf8] font-bold hover:underline">
                Cashout →
              </Link>
              <span className="text-white/65 font-medium text-[11.5px]">+62% Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Activity & Balances */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#0e2718] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ff7a1a]" /> Financial Activity & Balances
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
            Lifetime metrics, settled payouts, processing cashouts, and ready Credits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Lifetime Earnings */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(255, 122, 26, 0.15)', color: '#ff7a1a' }}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(255, 122, 26, 0.15)', color: '#ff9f43' }}
              >
                All Time
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-white leading-tight mb-1.5">
              ${walletData.totalEarning.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Total Lifetime Earnings</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Accumulated profits from 8-level commissions, donation cycles, and rank bonuses
            </p>
          </div>

          {/* 2. Total Withdrawn */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                Settled
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-white leading-tight mb-1.5">
              ${walletData.totalWithdrawn.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Total Withdrawn</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Total amount successfully transferred to your external BEP-20 wallet
            </p>
          </div>

          {/* 3. Pending Cashouts */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                Processing
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-white leading-tight mb-1.5">
              ${walletData.pendingWithdraw.toFixed(2)}
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Pending Cashouts</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Withdrawals awaiting admin clearance and automated broadcast
            </p>
          </div>

          {/* 4. Available Credits */}
          <div
            className="rounded-[16px] p-5 shadow-sm transition-all hover:-translate-y-1"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <Ticket className="w-5 h-5" />
              </div>
              <span
                className="text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.3px]"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                Ready
              </span>
            </div>
            <div className="text-[26px] font-extrabold text-white leading-tight mb-1.5">
              {walletData.activePins} <span className="text-sm font-medium text-white/65">Credits</span>
            </div>
            <div className="text-[13.5px] font-bold text-white/85 mb-1">Available Credits</div>
            <p className="text-[11.5px] text-white/55 leading-relaxed">
              Unused Credits available for donation queue entry or downline transfer
            </p>
          </div>
        </div>
      </div>

      {/* Earnings by Income Stream Breakdown */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#0e2718] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff7a1a]" /> Earnings by Income Stream
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
            Detailed breakdown of total earnings accumulated by category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Direct Referral Commission */}
          <div
            className="rounded-[14px] p-4 shadow-sm transition-all hover:-translate-y-0.5"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-base"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
              >
                <Users className="w-4 h-4" />
              </div>
              <Link to="/user/referral-income" className="text-white/50 hover:text-[#ff7a1a] text-[11.5px] font-medium flex items-center gap-0.5 transition-colors">
                Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-xl font-extrabold text-white mb-1">
              ${walletData.incomeStreams.referralIncome.toFixed(2)}
            </div>
            <div className="text-[12.5px] font-bold text-white/85 mb-0.5">Direct Referral Commission</div>
            <p className="text-[11px] text-white/50">Level 1: 8.00% bonus on personal sponsor line donations</p>
          </div>

          {/* Level Team Commission */}
          <div
            className="rounded-[14px] p-4 shadow-sm transition-all hover:-translate-y-0.5"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-base"
                style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
              >
                <Network className="w-4 h-4" />
              </div>
              <Link to="/user/level-income" className="text-white/50 hover:text-[#ff7a1a] text-[11.5px] font-medium flex items-center gap-0.5 transition-colors">
                Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-xl font-extrabold text-white mb-1">
              ${walletData.incomeStreams.levelIncome.toFixed(2)}
            </div>
            <div className="text-[12.5px] font-bold text-white/85 mb-0.5">Level Team Commission</div>
            <p className="text-[11px] text-white/50">Total multi-tier distribution across your organization</p>
          </div>

          {/* FIFO Donation Growth (162%) */}
          <div
            className="rounded-[14px] p-4 shadow-sm transition-all hover:-translate-y-0.5"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-base"
                style={{ background: 'rgba(255, 122, 26, 0.15)', color: '#ff7a1a' }}
              >
                <RotateCcw className="w-4 h-4" />
              </div>
              <Link to="/user/donation-earnings" className="text-white/50 hover:text-[#ff7a1a] text-[11.5px] font-medium flex items-center gap-0.5 transition-colors">
                Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-xl font-extrabold text-white mb-1">
              ${walletData.incomeStreams.donationIncome.toFixed(2)}
            </div>
            <div className="text-[12.5px] font-bold text-white/85 mb-0.5">FIFO Donation Growth (162%)</div>
            <p className="text-[11px] text-white/50">Completed 2:1 queue returns (81% x 2 matched donors)</p>
          </div>

          {/* Rank & Leadership Rewards */}
          <div
            className="rounded-[14px] p-4 shadow-sm transition-all hover:-translate-y-0.5"
            style={{
              background: '#0c2c23',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-base"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
              >
                <Award className="w-4 h-4" />
              </div>
              <Link to="/user/ranks" className="text-white/50 hover:text-[#ff7a1a] text-[11.5px] font-medium flex items-center gap-0.5 transition-colors">
                Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="text-xl font-extrabold text-white mb-1">
              ${walletData.incomeStreams.rankRewardIncome.toFixed(2)}
            </div>
            <div className="text-[12.5px] font-bold text-white/85 mb-0.5">Rank & Leadership Rewards</div>
            <p className="text-[11px] text-white/50">Volume bonuses for milestone achievers and team builders</p>
          </div>
        </div>
      </div>

      {/* Recent Wallet Transactions Ledger */}
      <div
        className="rounded-[16px] overflow-hidden shadow-sm"
        style={{
          background: '#0c2c23',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          className="p-5 flex flex-wrap items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff7a1a]" /> Recent Financial Ledger
            </h3>
            <p className="text-xs text-white/55">Latest balance changes, commission credits, and withdrawal deductions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/user/transactions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="px-5 py-3 flex flex-wrap items-center justify-between gap-3"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-white bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff7a1a] focus:border-[#ff7a1a] placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['ALL', 'REFERRAL', 'DONATION', 'LEVEL', 'WITHDRAW', 'RANK', 'EPIN'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === type
                    ? 'bg-[#ff7a1a] text-white shadow-sm'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px] border-collapse m-0">
            <thead>
              <tr style={{ background: 'rgba(0, 0, 0, 0.25)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th className="px-5 py-3 text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Transaction ID</th>
                <th className="px-4 py-3 text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Category</th>
                <th className="px-4 py-3 text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Description</th>
                <th className="px-4 py-3 text-right text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Amount</th>
                <th className="px-4 py-3 text-right text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Balance After</th>
                <th className="px-5 py-3 text-[11.5px] font-bold text-white/60 uppercase tracking-[0.5px]">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isCredit = tx.amount >= 0;
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                        style={{ background: 'rgba(255, 122, 26, 0.1)', color: '#ff9f43' }}
                      >
                        {tx.id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          tx.type === 'REFERRAL' ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30' :
                          tx.type === 'DONATION' ? 'bg-[#ff7a1a]/15 text-[#ff9f43] border border-[#ff7a1a]/30' :
                          tx.type === 'LEVEL' ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30' :
                          tx.type === 'WITHDRAW' ? 'bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/30' :
                          tx.type === 'RANK' ? 'bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30' :
                          tx.type === 'EPIN' ? 'bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30' :
                          'bg-white/10 text-white'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/85 font-medium max-w-xs truncate">
                      {tx.desc}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-[13.5px]">
                      <span style={{ color: isCredit ? '#22c55e' : '#ef4444' }}>
                        {isCredit ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                      ${tx.balanceAfter.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-white/55 text-xs whitespace-nowrap">
                      {tx.date}
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

export default UserWalletPage;
