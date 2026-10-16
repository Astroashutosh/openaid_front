import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Gift,
  CheckCircle2,
  Truck
} from 'lucide-react';

export const UserRankRewardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'progress' | 'claim'>('progress');
  const [selectedReward, setSelectedReward] = useState<string>('blender');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const [shippingForm, setShippingForm] = useState({
    fullName: 'Alex Johnson',
    phone: '+1 (555) 234-8900',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    country: 'United States'
  });

  const ranks = [
    {
      id: 1,
      name: 'Starter',
      icon: '⭐',
      directReq: 0,
      volumeReq: 0,
      reward: 'Free Entry & Queue Access',
      status: 'Achieved',
      currentDirect: 4,
      currentVolume: 1850
    },
    {
      id: 2,
      name: 'Builder',
      icon: '🥉',
      directReq: 5,
      volumeReq: 1500,
      reward: '$50 Cash or Electric Blender',
      status: 'In Progress',
      currentDirect: 4,
      currentVolume: 1850
    },
    {
      id: 3,
      name: 'Leader',
      icon: '🥈',
      directReq: 10,
      volumeReq: 5000,
      reward: '$150 Cash or Electric Kettle / Rice Cooker',
      status: 'Locked',
      currentDirect: 4,
      currentVolume: 1850
    },
    {
      id: 4,
      name: 'Director',
      icon: '🥇',
      directReq: 25,
      volumeReq: 20000,
      reward: '$500 Cash or Standing Fan / Tablet',
      status: 'Locked',
      currentDirect: 4,
      currentVolume: 1850
    },
    {
      id: 5,
      name: 'Ambassador',
      icon: '💎',
      directReq: 50,
      volumeReq: 75000,
      reward: '$2,000 Cash or Luxury International Trip',
      status: 'Locked',
      currentDirect: 4,
      currentVolume: 1850
    },
    {
      id: 6,
      name: 'Crown Ambassador',
      icon: '👑',
      directReq: 100,
      volumeReq: 250000,
      reward: '$7,500 Cash or Brand New Car',
      status: 'Locked',
      currentDirect: 4,
      currentVolume: 1850
    }
  ];

  const claimedHistory = [
    {
      id: 'CLM#401',
      rank: 'Starter',
      type: 'Cash Milestone ($50 USDT)',
      status: 'Cleared & Paid',
      date: 'Oct 05, 2026'
    }
  ];

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setClaimSuccess(`Reward claim submitted successfully for ${selectedReward}! Our logistics team will process dispatch.`);
      setTimeout(() => setClaimSuccess(null), 6000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Rank Rewards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Rank Advancement & Claim Rewards</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track qualification towards leadership ranks and claim your milestone physical gifts or cash awards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('claim')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
          >
            <Gift className="w-4 h-4" /> Claim Rewards Screen
          </button>
        </div>
      </div>

      {claimSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {claimSuccess}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'progress'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" /> Rank Advancement Roadmap (6 Tiers)
        </button>
        <button
          onClick={() => setActiveTab('claim')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'claim'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gift className="w-4 h-4" /> Claim Milestone Gifts & History
        </button>
      </div>

      {/* Tab 1: Roadmap */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ranks.map((r) => {
              const directProgress = r.directReq > 0 ? Math.min(100, (r.currentDirect / r.directReq) * 100) : 100;
              const volumeProgress = r.volumeReq > 0 ? Math.min(100, (r.currentVolume / r.volumeReq) * 100) : 100;
              const isAchieved = r.status === 'Achieved';
              const isInProgress = r.status === 'In Progress';

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-3xl p-5 border-2 shadow-sm flex flex-col justify-between transition-all ${
                    isAchieved
                      ? 'border-emerald-500 bg-emerald-50/10'
                      : isInProgress
                      ? 'border-orange-500 bg-orange-50/10'
                      : 'border-slate-200 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{r.icon}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isAchieved ? 'bg-emerald-100 text-emerald-800' :
                        isInProgress ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-1">{r.name}</h3>
                    <p className="text-xs text-orange-600 font-bold mb-4">{r.reward}</p>

                    <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span>Direct Referrals:</span>
                          <strong className="text-slate-800">{r.currentDirect}/{r.directReq}</strong>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${directProgress}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span>Team Volume:</span>
                          <strong className="text-slate-800">${r.currentVolume.toLocaleString()}/${r.volumeReq.toLocaleString()}</strong>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${volumeProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isAchieved ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-center">
                        <CheckCircle2 className="w-4 h-4" /> Qualified Tier
                      </span>
                    ) : isInProgress ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('claim');
                          setIsModalOpen(true);
                        }}
                        className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                      >
                        Claim Reward Upon Completion →
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 text-center block">Requires Higher Volume</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Claim Screen */}
      {activeTab === 'claim' && (
        <div className="space-y-6">
          {/* Pending Claim Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase">
                Ready for Dispatch
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Builder Rank Qualification Reward</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Congratulations on advancing toward Builder rank! Select your preferred gift (Electric blender, Electric kettle, Rice cooker, or Standing fan) or cash alternative.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 self-start md:self-auto flex-shrink-0"
            >
              <Gift className="w-4 h-4" /> Open Claim Selector
            </button>
          </div>

          {/* Past Claims Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Claim History</h3>
              <span className="text-xs text-slate-500 font-semibold">{claimedHistory.length} Claims</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-3.5">Claim ID</th>
                    <th className="px-4 py-3.5">Milestone Rank</th>
                    <th className="px-4 py-3.5">Reward Selected</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5">Date Claimed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claimedHistory.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-slate-700">{c.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{c.rank}</td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{c.type}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 text-xs whitespace-nowrap">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-500" /> Claim Leadership Reward
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Select Physical Reward or Cash */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Reward Option <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedReward}
                  onChange={(e) => setSelectedReward(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="Electric blender">Electric blender (Physical Delivery)</option>
                  <option value="Electric kettle">Electric kettle (Physical Delivery)</option>
                  <option value="Rice cooker">Rice cooker (Physical Delivery)</option>
                  <option value="Standing fan">Standing fan (Physical Delivery)</option>
                  <option value="$50 Cash USDT">Instant Cashout ($50.00 USDT into Commission Wallet)</option>
                </select>
              </div>

              {/* Shipping Address Details (if physical) */}
              {selectedReward !== '$50 Cash USDT' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Physical Delivery Shipping Address:
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Country</label>
                      <input
                        type="text"
                        value={shippingForm.country}
                        onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/25"
                >
                  {isSubmitting ? 'Submitting Claim...' : 'Confirm Reward Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserRankRewardsPage;
