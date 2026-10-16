import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Megaphone,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const UserAnnouncementsPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const announcements = [
    {
      id: 1,
      title: 'Decentralized 2:1 FIFO Engine Matching Optimization Completed',
      priority: 'HIGH',
      date: 'Oct 11, 2026',
      content: 'We have deployed optimized batching contracts that decrease donor pairing latency by 65%. Positions now clear faster while maintaining strict mathematical 162% cycle payout solvency across all 4 package tiers.'
    },
    {
      id: 2,
      title: 'Leadership Rank Rewards Q4 Physical Dispatch Update',
      priority: 'MEDIUM',
      date: 'Oct 06, 2026',
      content: 'Members qualifying for Builder, Leader, and Director rank physical gifts (Electric blenders, rice cookers, standing fans) can now input delivery shipping addresses directly in the Claim Rewards portal.'
    },
    {
      id: 3,
      title: 'USDT BEP-20 Network Fast Clearance Notice',
      priority: 'INFO',
      date: 'Sep 28, 2026',
      content: 'Please ensure that all payout destination wallet addresses saved in your account profile are on the Binance Smart Chain (BEP-20) network. Never use ERC-20 or TRC-20 addresses for cashout requests.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Announcements</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Platform Announcements</h1>
          <p className="text-xs sm:text-sm text-slate-500">Official protocol news, system upgrades, and community alerts.</p>
        </div>

        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-emerald-600" /> {announcements.length} Official Bulletins
        </span>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a) => {
          const isExpanded = expandedId === a.id;
          return (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : a.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/60"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    a.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' :
                    a.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                    'bg-sky-50 text-sky-600'
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        a.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                        a.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {a.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {a.date}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">{a.title}</h2>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  {a.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default UserAnnouncementsPage;
