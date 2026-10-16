import React from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  ShieldCheck
} from 'lucide-react';

export const UserBusinessMaterialPage: React.FC = () => {
  const materials = [
    {
      id: 1,
      title: 'OpenAid Official Pitch Deck (English)',
      type: 'PDF Presentation',
      size: '4.8 MB',
      desc: 'Complete overview of 2:1 FIFO queuing mechanics, 162% cycle payout model, and leadership compensation plan.'
    },
    {
      id: 2,
      title: 'Community Compensation Plan Flyer & Ranks',
      type: 'PDF Infographic',
      size: '2.1 MB',
      desc: 'High-resolution quick-reference chart of 8-level referral bonuses and 6 rank milestone awards.'
    },
    {
      id: 3,
      title: 'Brand Identity Logo Kit & Vectors',
      type: 'ZIP Asset Archive',
      size: '12.4 MB',
      desc: 'Official high-resolution PNG, SVG, and vector logomarks, badges, and dark/light color palette guidelines.'
    },
    {
      id: 4,
      title: 'Social Media Promotional Story Banners (Set of 10)',
      type: 'ZIP Graphics Package',
      size: '8.2 MB',
      desc: 'Pre-designed 1080x1920 Instagram and WhatsApp stories with QR placeholders for your personal referral link.'
    }
  ];

  const handleDownload = (title: string) => {
    alert(`Initiating download for: ${title}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Business Materials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Marketing & Promotional Material</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Download verified presentation slides, brand logos, PDF brochures, and social media flyers to grow your organization.
          </p>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {materials.map((m) => (
          <div key={m.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-bold">
                  {m.type}
                </span>
                <span className="text-slate-400 font-semibold">{m.size}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{m.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Asset
              </span>
              <button
                type="button"
                onClick={() => handleDownload(m.title)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserBusinessMaterialPage;
