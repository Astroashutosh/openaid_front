import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Check,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  rank: string;
  isActive: boolean;
  donationsGiven: number;
  referralsCount: number;
  children?: TreeNode[];
}

export const UserGenealogyPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const referralLink = 'https://openaid.network/register?ref=OAI901248';

  const rootNode: TreeNode = {
    id: 'OAI901248',
    name: 'You (Alex Crypto)',
    rank: 'Starter',
    isActive: true,
    donationsGiven: 300,
    referralsCount: 4,
    children: [
      {
        id: 'OAI901250',
        name: 'Sarah Connor',
        rank: 'Starter',
        isActive: true,
        donationsGiven: 100,
        referralsCount: 2,
        children: [
          {
            id: 'OAI901301',
            name: 'John Connor',
            rank: 'Starter',
            isActive: true,
            donationsGiven: 50,
            referralsCount: 0
          },
          {
            id: 'OAI901305',
            name: 'Kyle Reese',
            rank: 'Starter',
            isActive: false,
            donationsGiven: 0,
            referralsCount: 0
          }
        ]
      },
      {
        id: 'OAI901255',
        name: 'David Miller',
        rank: 'Starter',
        isActive: true,
        donationsGiven: 200,
        referralsCount: 1,
        children: [
          {
            id: 'OAI901320',
            name: 'Grace Hopper',
            rank: 'Starter',
            isActive: true,
            donationsGiven: 100,
            referralsCount: 0
          }
        ]
      },
      {
        id: 'OAI901262',
        name: 'Elena Rostova',
        rank: 'Starter',
        isActive: false,
        donationsGiven: 0,
        referralsCount: 0
      },
      {
        id: 'OAI901270',
        name: 'Kenji Sato',
        rank: 'Starter',
        isActive: true,
        donationsGiven: 100,
        referralsCount: 0
      }
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderNode = (node: TreeNode, isRoot: boolean = false) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div className={`rounded-2xl p-3 sm:p-4 border-2 shadow-sm text-center min-w-[140px] sm:min-w-[170px] transition-all hover:scale-105 ${
          isRoot
            ? 'bg-emerald-950 text-white border-amber-400 shadow-emerald-950/20'
            : node.isActive
            ? 'bg-white text-slate-800 border-emerald-500 shadow-emerald-500/10'
            : 'bg-slate-50 text-slate-500 border-slate-300'
        }`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className={`w-2 h-2 rounded-full ${node.isActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{node.rank}</span>
          </div>

          <div className="font-mono font-bold text-xs sm:text-sm truncate max-w-[150px]">{node.id}</div>
          <div className="text-[11px] font-semibold truncate max-w-[150px] opacity-90">{node.name}</div>

          <div className={`mt-2 pt-1.5 border-t text-[10px] flex justify-between ${
            isRoot ? 'border-white/20 text-emerald-200' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Donated: ${node.donationsGiven}</span>
            <span>Ref: {node.referralsCount}</span>
          </div>
        </div>

        {/* Children Line and Tree */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center mt-3">
            <div className="w-0.5 h-4 bg-slate-300" />
            <div className="flex items-start justify-center gap-4 sm:gap-8 pt-3 border-t-2 border-slate-300">
              {node.children.map(child => renderNode(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-sm bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <Link to="/user/dashboard" className="text-slate-500 hover:text-emerald-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold">Genealogy Team Tree</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
           style={{ background: 'linear-gradient(135deg, #0c2c23 34%, #0E2718 38%, #FF7A1A 110%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-amber-300 bg-white/10 backdrop-blur-md uppercase">
              Visual Downline Organization
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Genealogy Team Network</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Explore your complete multi-tier community tree. Track active donors, node placements, and 8-level generation volume.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="text-2xl font-black text-amber-300">4</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Direct Ref</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="text-2xl font-black text-white">7</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Team Size</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
              <div className="text-2xl font-black text-emerald-300">5</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Active Donors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link & Legend Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-7 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Your Link:</span>
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-slate-50 text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center gap-1 flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="md:col-span-5 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-950 border border-amber-400" />
            <span className="text-slate-700 font-semibold">You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-semibold">Active Donor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="text-slate-700 font-semibold">Inactive</span>
          </div>
        </div>
      </div>

      {/* Visual Tree Panel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Member ID in tree..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 10))}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 font-mono w-12 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree Canvas */}
        <div className="p-8 sm:p-12 overflow-x-auto min-h-[420px] flex justify-center bg-slate-50/30">
          <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }} className="transition-transform duration-200">
            {renderNode(rootNode, true)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserGenealogyPage;
