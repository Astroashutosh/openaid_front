import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Send,
  ShoppingCart,
  Copy,
  Check,
  Search,
  Inbox
} from 'lucide-react';

interface EpinItem {
  id: string;
  code: string;
  packageTitle: string;
  price: number;
  status: 'Available' | 'Transferred' | 'Received';
  createdAt: string;
  recipient?: string;
  sender?: string;
}

export const UserEpinsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'transferred' | 'received'>('available');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const epins: EpinItem[] = [
    {
      id: '1',
      code: 'CRD-902184-XYZ',
      packageTitle: 'Starter Support Package ($100)',
      price: 10.0,
      status: 'Available',
      createdAt: '11 Oct 2026, 04:30 PM'
    },
    {
      id: '2',
      code: 'CRD-884129-ABC',
      packageTitle: 'Starter Support Package ($100)',
      price: 10.0,
      status: 'Available',
      createdAt: '10 Oct 2026, 02:15 PM'
    },
    {
      id: '3',
      code: 'CRD-772104-DEF',
      packageTitle: 'Community Micro Seed ($50)',
      price: 5.0,
      status: 'Available',
      createdAt: '05 Oct 2026, 11:20 AM'
    },
    {
      id: '4',
      code: 'CRD-542198-JKL',
      packageTitle: 'Starter Support Package ($100)',
      price: 10.0,
      status: 'Transferred',
      createdAt: '28 Sep 2026, 09:10 AM',
      recipient: 'Alex Johnson (OAI9812)'
    },
    {
      id: '5',
      code: 'CRD-431092-MNP',
      packageTitle: 'Growth Builder Tier ($250)',
      price: 25.0,
      status: 'Received',
      createdAt: '20 Sep 2026, 06:45 PM',
      sender: 'System Admin / Sponsor'
    }
  ];

  const availablePins = epins.filter((e) => e.status === 'Available');
  const transferredPins = epins.filter((e) => e.status === 'Transferred');
  const receivedPins = epins.filter((e) => e.status === 'Received');

  const currentList =
    activeTab === 'available'
      ? availablePins
      : activeTab === 'transferred'
      ? transferredPins
      : receivedPins;

  const filtered = currentList.filter(
    (e) =>
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.packageTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions matching epin/index.blade.php */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0E2718] mb-1">My Credits</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your activation Credits, transfer Credits to other members, or review transfer logs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/user/buy-epins"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold transition shadow-sm"
            style={{ background: '#FF7A1A' }}
          >
            <ShoppingCart className="w-4 h-4" /> Buy Credits Packages
          </Link>
          <Link
            to="/user/transfer-epin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition"
          >
            <Send className="w-4 h-4 text-emerald-600" /> Transfer Credits
          </Link>
        </div>
      </div>

      {/* 3 Stats Gradient Cards matching epin/index.blade.php */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Available Active Credits */}
        <div
          className="rounded-2xl p-5 shadow-sm text-white"
          style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/80 font-medium">Available Active Credits</span>
              <h3 className="text-3xl font-black my-1 text-white">{availablePins.length}</h3>
              <small className="text-xs text-white/80">
                Total Value: ${(availablePins.length * 10).toFixed(2)}
              </small>
            </div>
            <div className="text-4xl opacity-90">🎟️</div>
          </div>
        </div>

        {/* Card 2: Credits Transferred Out */}
        <div
          className="rounded-2xl p-5 shadow-sm text-white"
          style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/80 font-medium">Credits Transferred Out</span>
              <h3 className="text-3xl font-black my-1 text-white">{transferredPins.length}</h3>
              <small className="text-xs text-white/80">Sent to team members</small>
            </div>
            <div className="text-4xl opacity-90">📤</div>
          </div>
        </div>

        {/* Card 3: Credits Received In */}
        <div
          className="rounded-2xl p-5 shadow-sm text-white"
          style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/80 font-medium">Credits Received In</span>
              <h3 className="text-3xl font-black my-1 text-white">{receivedPins.length}</h3>
              <small className="text-xs text-white/80">From transfers / system</small>
            </div>
            <div className="text-4xl opacity-90">📥</div>
          </div>
        </div>
      </div>

      {/* Tabs & Table Card matching Blade */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Tabs matching nav-pills */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'available'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" /> Available Credits ({availablePins.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transferred')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'transferred'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Transferred Out ({transferredPins.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'received'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" /> Received In ({receivedPins.length})
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Credit Code or Tier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tab Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">#</th>
                <th className="px-4 py-3.5">Credits Code</th>
                <th className="px-4 py-3.5">Value</th>
                <th className="px-4 py-3.5">Status</th>
                {activeTab === 'transferred' && <th className="px-4 py-3.5">Recipient</th>}
                {activeTab === 'received' && <th className="px-4 py-3.5">Transferred By</th>}
                <th className="px-4 py-3.5">Created Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pin, idx) => (
                <tr key={pin.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-2">
                      <code className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 text-slate-800 rounded border border-slate-200">
                        {pin.code}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(pin.code)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode === pin.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-emerald-600">${pin.price.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pin.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : pin.status === 'Transferred'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {pin.status === 'Available' ? 'Active / Ready' : pin.status}
                    </span>
                  </td>

                  {activeTab === 'transferred' && (
                    <td className="px-4 py-4 font-semibold text-slate-800">{pin.recipient}</td>
                  )}
                  {activeTab === 'received' && (
                    <td className="px-4 py-4 font-semibold text-slate-800">{pin.sender}</td>
                  )}

                  <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {pin.createdAt}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {pin.status === 'Available' ? (
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/user/transfer-epin?pin_code=${pin.code}`}
                          className="px-2.5 py-1 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition"
                          title="Transfer this Credit"
                        >
                          Transfer
                        </Link>
                        <Link
                          to="/user/make-donation"
                          className="px-2.5 py-1 rounded-lg bg-[#0e3228] hover:bg-[#154639] text-white text-xs font-bold transition shadow-xs"
                          title="Use in Donation Request"
                        >
                          Use in MD
                        </Link>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="text-4xl mb-2">🎟️</div>
                    <div className="font-bold text-slate-700 text-sm mb-1">
                      No Credits in this tab
                    </div>
                    <p className="text-xs text-slate-400 mb-4">
                      You do not have any {activeTab} Credits in your account.
                    </p>
                    {activeTab === 'available' && (
                      <Link
                        to="/user/buy-epins"
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold inline-flex items-center gap-1.5"
                        style={{ background: '#FF7A1A' }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy Credit Package
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default UserEpinsPage;
