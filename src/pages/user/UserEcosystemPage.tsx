import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Coins,
  ShoppingBag,
  Bot,
  Calendar,
  BookOpen,
  CheckCircle2,
  Cpu,
  Mail
} from 'lucide-react';

interface Props {
  moduleType?: 'academy' | 'token' | 'market' | 'bot' | 'news';
}

export const UserEcosystemPage: React.FC<Props> = ({ moduleType = 'academy' }) => {
  const [activeModule, setActiveModule] = useState<'academy' | 'token' | 'market' | 'bot' | 'news'>(moduleType);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const courses = [
    {
      id: 1,
      title: 'Decentralized Peer-to-Peer Helping Protocol Essentials',
      category: 'Blockchain Economics',
      lessons: '8 Lessons',
      duration: '45 Mins',
      desc: 'Master the 2:1 FIFO queuing mechanism, recommitment tokenomics, and community liquidity velocity.'
    },
    {
      id: 2,
      title: 'USDT BEP-20 Security, Wallets & On-Chain Settlement',
      category: 'Web3 Security',
      lessons: '6 Lessons',
      duration: '35 Mins',
      desc: 'Learn proper non-custodial wallet management, contract address verification, and fraud prevention.'
    },
    {
      id: 3,
      title: 'Building a High-Impact Community Leadership Team',
      category: 'Community Growth',
      lessons: '10 Lessons',
      duration: '1 Hour',
      desc: 'Discover organizational strategies to climb all 6 leadership ranks and maximize 8-tier level rewards.'
    }
  ];

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
      setWaitlistEmail('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to="/user/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">OpenAid Ecosystem</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Ecosystem Hub & OpenAid Academy</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Educational courses, utility token roadmap, decentralized marketplace, and autonomous AI trading tools.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveModule('academy')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeModule === 'academy' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> OpenAid Academy
        </button>
        <button
          onClick={() => setActiveModule('token')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeModule === 'token' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-4 h-4" /> OpenAid Token (OAI)
        </button>
        <button
          onClick={() => setActiveModule('market')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeModule === 'market' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> P2P Marketplace
        </button>
        <button
          onClick={() => setActiveModule('bot')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeModule === 'bot' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4" /> AI Yield Bot
        </button>
        <button
          onClick={() => setActiveModule('news')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeModule === 'news' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Global News & Events
        </button>
      </div>

      {/* Academy Module View */}
      {activeModule === 'academy' && (
        <div className="space-y-5">
          <div className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #0c2c23 0%, #165b4c 100%)' }}>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-400 text-slate-950 inline-block mb-3">
              Free Community Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">OpenAid Web3 Academy</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Curated masterclasses designed to empower community members with decentralized finance knowledge, queue mathematics, and leadership mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      {course.category}
                    </span>
                    <span className="text-slate-400 font-medium">{course.duration}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{course.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">{course.lessons}</span>
                  <button
                    type="button"
                    onClick={() => alert(`Opening course content for: ${course.title}`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Ecosystem Modules (Token, Market, Bot, News) */}
      {activeModule !== 'academy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
            {activeModule === 'token' ? <Coins className="w-8 h-8" /> :
             activeModule === 'market' ? <ShoppingBag className="w-8 h-8" /> :
             activeModule === 'bot' ? <Bot className="w-8 h-8" /> :
             <Calendar className="w-8 h-8" />}
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 uppercase">
              Under Active Engineering
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2 mb-1">
              {activeModule === 'token' ? 'OpenAid Token (OAI) Protocol' :
               activeModule === 'market' ? 'Decentralized P2P Goods & Services' :
               activeModule === 'bot' ? 'Autonomous AI Yield Trading Bot' :
               'Global Offline Summits & Events'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              This module is currently in stage 3 testing. Join the priority waitlist to receive direct early-access announcements.
            </p>
          </div>

          {/* Development Progress */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-500" /> Phase 3: Smart Contract Auditing</span>
              <span className="text-orange-600">85% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Waitlist Form */}
          {waitlistSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You're on the priority waitlist! We will alert you upon mainnet launch.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email for early access..."
                required
                className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white"
              />
              <button
                type="submit"
                className="px-5 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <Mail className="w-4 h-4" /> Notify Me
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
export default UserEcosystemPage;
