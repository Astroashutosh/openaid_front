import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Check,
  UserCheck
} from 'lucide-react';

export const UserMyReferralsPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sponsor = {
    username: 'sponsor_pro',
    name: 'Michael Chang'
  };

  const referralLink = 'https://openaid.network/register?ref=OAI901248';

  const directUsers = [
    {
      id: 'OAI901250',
      name: 'Sarah Connor',
      email: 'sarah.c@gmail.com',
      country: 'United States',
      status: 'Active',
      joinedDate: 'Oct 10, 2026'
    },
    {
      id: 'OAI901255',
      name: 'David Miller',
      email: 'david.m@proton.me',
      country: 'United Kingdom',
      status: 'Active',
      joinedDate: 'Oct 08, 2026'
    },
    {
      id: 'OAI901262',
      name: 'Elena Rostova',
      email: 'elena.rostova@yandex.com',
      country: 'Germany',
      status: 'Inactive',
      joinedDate: 'Oct 04, 2026'
    },
    {
      id: 'OAI901270',
      name: 'Kenji Sato',
      email: 'kenji.sato@outlook.jp',
      country: 'Japan',
      status: 'Active',
      joinedDate: 'Sep 29, 2026'
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-sm bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <Link to="/user/dashboard" className="text-slate-500 hover:text-emerald-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold">My Direct Referrals</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0c2c23 34%, #0E2718 38%, #FF7A1A 110%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-amber-300 bg-white/10 backdrop-blur-md uppercase">
              Grow Your Global Circle
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Invite Friends, Earn 8% Direct Rewards</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Share your unique decentralized referral link with your network. Earn 8.00% immediate sponsor rewards on every package donation made by your direct invites.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[150px] self-start md:self-auto">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">{directUsers.length}</div>
            <div className="text-xs font-bold text-white/80 uppercase tracking-wider mt-0.5">Total Referrals</div>
          </div>
        </div>
      </div>

      {/* Referrer Sponsor Badge */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-bold shadow-sm">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-800">
          You were introduced to OpenAid by <strong>{sponsor.username}</strong> ({sponsor.name})
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your Personal Referral Link</h2>
          <p className="text-xs text-slate-500">Share this link across social channels or directly with prospective donors.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 font-mono outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Link!' : 'Copy Link'}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Or share instantly via:</span>
          <a
            href={`https://api.whatsapp.com/send?text=Join%20OpenAid%20with%20me:%20${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20OpenAid`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px] transition-colors"
          >
            Telegram
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=OpenAid%20Helping%20Protocol`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href={`mailto:?subject=Join%20OpenAid&body=${encodeURIComponent(referralLink)}`}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
          >
            Email
          </a>
        </div>
      </div>

      {/* Direct Referees Cards Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Directly Sponsored Members</h2>
            <p className="text-xs text-slate-500">People registered using your direct referral link.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {directUsers.length} Members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {directUsers.map((user) => (
            <div key={user.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {user.status}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">User ID:</span>
                  <strong className="text-slate-800 font-mono">{user.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <strong className="text-slate-800 truncate max-w-[120px]">{user.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-600 truncate max-w-[120px]" title={user.email}>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country:</span>
                  <span className="text-slate-700 font-medium">{user.country}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-right">
                Joined: {user.joinedDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserMyReferralsPage;
