import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
  Shield,
  Cpu,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import Header from '../../components/front/Header';
import Footer from '../../components/front/Footer';

// import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const HomePage: React.FC = () => {




  return (
    <div className="relative min-h-screen w-full bg-[#03150D] text-white selection:bg-[#D4A72C] selection:text-black font-sans antialiased">
      {/* Background radial glow & pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(212,167,44,0.16),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(212,167,44,0.10),transparent_35%),linear-gradient(135deg,#03150D_0%,#082A1B_50%,#03150D_100%)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.14] bg-[linear-gradient(rgba(212,167,44,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.15)_1px,transparent_1px)] bg-[size:55px_55px]" />

      {/* =========================================================
           NAVBAR (Sticky Header)
      ========================================================= */}
      <Header />


      {/* =========================================================
           HERO SECTION (#home)
      ========================================================= */}
      <section id="home" className="relative min-h-[calc(100vh-76px)] w-full overflow-hidden flex items-center py-16 lg:py-24">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#D4A72C]/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A72C]/10 border border-[#D4A72C]/30 text-[#D4A72C] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(212,167,44,0.12)]">
                <span className="w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse" />
                Decentralized P2P Community
              </div>

              <h1 className="text-white font-black leading-[1.08] tracking-[-2px] text-4xl sm:text-5xl md:text-6xl lg:text-[62px]">
                Building the Future of Global Community Through <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A72C] via-[#F2C14E] to-[#D4A72C]">
                  Blockchain Automation P2P System.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl mx-auto lg:mx-0 text-white/70 text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed">
                A digital platform designed to facilitate structured transparent member-to-member donation cycle through blockchain automated Sequential FIFO matching system.
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-black font-extrabold text-base shadow-[0_0_35px_rgba(212,167,44,0.3)] hover:shadow-[0_0_50px_rgba(212,167,44,0.5)] hover:-translate-y-0.5 transition flex items-center justify-center gap-2.5"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] border border-[#D4A72C]/30 text-white font-bold text-base hover:bg-[#D4A72C]/10 hover:border-[#D4A72C]/60 transition flex items-center justify-center"
                >
                  Member Sign In
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-white/60 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#D4A72C] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>100% Transparent</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#D4A72C] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>2:1 FIFO Queue Matching</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#D4A72C]/20 text-[#D4A72C] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Instant Network Settlement</span>
                </div>
              </div>
            </div>

            {/* Right OAI Graphic (Faithful to index.blade.php lines 900-1055) */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative shrink-0 w-[300px] h-[350px] sm:w-[380px] sm:h-[420px] lg:w-[420px] lg:h-[430px] rounded-[55px] bg-[#07351f] shadow-[0_20px_70px_rgba(0,0,0,0.5)] border border-[#D4A72C]/20 overflow-hidden flex items-center justify-center">
                {/* Radial Glow Layer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,193,78,0.85)_0%,rgba(169,106,37,0.75)_28%,rgba(11,59,39,0.95)_58%,rgba(3,21,13,1)_82%)]" />

                {/* Outer Ring */}
                <div className="absolute w-[88%] aspect-square rounded-full border border-[#D4A72C]/50 shadow-[0_0_20px_rgba(212,167,44,0.35)] animate-[spin_60s_linear_infinite]" />

                {/* Inner Ring */}
                <div className="absolute w-[80%] aspect-square rounded-full border border-[#D4A72C]/30" />

                {/* Center Core Glow */}
                <div className="absolute w-[55%] aspect-square rounded-full bg-[#D4A72C]/25 blur-2xl pointer-events-none" />

                {/* OAI Center Card */}
                <div className="relative z-10 w-[140px] h-[86px] sm:w-[160px] sm:h-[98px] rounded-[20px] bg-black border border-[#D4A72C]/50 flex flex-col items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.7)] group hover:scale-105 transition duration-300">
                  <span className="text-[#D4A72C] font-black text-3xl sm:text-4xl tracking-wider">
                    OAI
                  </span>
                  <span className="text-[9px] font-bold text-white/70 tracking-widest uppercase">
                    OpenAid Int.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           ABOUT / HOW IT WORKS SECTION (#about)
      ========================================================= */}
      <section id="about" className="relative min-h-screen bg-black/70 overflow-hidden py-20 lg:py-28 border-t border-white/5">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: How It Works & Video */}
            <div>
              <div className="inline-flex items-center px-5 py-2 rounded-xl border-[3px] border-[#F2C14E] text-white text-3xl sm:text-4xl lg:text-5xl font-black mb-8 shadow-[0_0_30px_rgba(242,193,78,0.15)]">
                HOW IT WORKS
              </div>



              {/* Video Player Card */}
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-[36px] bg-[#0B3B27] border border-[#D4A72C]/30 shadow-[0_0_45px_rgba(212,167,44,0.15)] group">


                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/LNfX-M_o4kk?autoplay=1&mute=1&playsinline=1&loop=1&playlist=LNfX-M_o4kk&rel=0"
                  title="What is OpenAid International?"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />

                {/* Watch On YouTube Overlay Button */}
                <a
                  href="https://youtu.be/LNfX-M_o4kk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-4 bottom-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold shadow-[0_8px_25px_rgba(0,0,0,0.35)] hover:bg-gray-100 hover:scale-105 transition"
                >
                  <ExternalLink className="w-4 h-4 text-red-600" />
                  Watch on YouTube
                </a>

              </div>





            </div>

            {/* Right: What is OpenAid */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B3B27] border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase tracking-widest mb-6">
                Decentralized Community Platform
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                What Is OpenAid <br />
                <span className="text-[#D4A72C]">International?</span>
              </h2>

              <p className="mt-6 text-white/80 text-lg sm:text-xl font-normal leading-relaxed">
                OpenAid International is a blockchain based P2P community funding platform where people raise funds to help each other. The platform is designed to facilitate transparent member-to-member Sequential FIFO matching.
              </p>

              <p className="mt-6 text-white/60 text-base sm:text-lg font-normal leading-relaxed">
                OAI was created with a vision to redefine how modern people participate in global P2P opportunities. Traditional financial systems often limit operations through centralized control, high fees, and unnecessary barriers for ordinary individuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           STORY BEHIND OAI (Problem Boxes matching blade)
      ========================================================= */}
      <section className="relative w-full bg-black/90 py-20 lg:py-28 overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-[#064125] text-white text-base sm:text-xl font-bold mb-6 border border-[#D4A72C]/20 shadow-[0_0_25px_rgba(6,65,37,0.5)]">
              Why OpenAid Was Created?
            </div>

            <h2 className="text-white font-black uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
              THE STORY BEHIND OAI
            </h2>

            <p className="max-w-4xl mx-auto mt-6 text-white/70 font-medium text-base sm:text-xl lg:text-2xl leading-relaxed">
              The idea of OAI was born after an extensive search when millions of people around the world were searching for financial independence but continuously faced the same problems: losing funds, scam websites, and opaque systems.
            </p>

            <div className="w-48 h-1 bg-[#0B3B27] mx-auto my-10 rounded-full" />
          </div>

          {/* Problem Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F2C14E] bg-[#0B3B27] text-white text-lg sm:text-2xl font-bold text-center flex items-center justify-center shadow-[0_10px_30px_rgba(11,59,39,0.3)] hover:-translate-y-1 transition duration-200">
              Centralized Control Over Money
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F2C14E] bg-[#0B3B27] text-white text-lg sm:text-2xl font-bold text-center flex items-center justify-center shadow-[0_10px_30px_rgba(11,59,39,0.3)] hover:-translate-y-1 transition duration-200">
              Lack Of Transparency
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F2C14E] bg-[#0B3B27] text-white text-lg sm:text-2xl font-bold text-center flex items-center justify-center shadow-[0_10px_30px_rgba(11,59,39,0.3)] hover:-translate-y-1 transition duration-200">
              Delayed Transactions &amp; Withdrawals
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F2C14E] bg-[#0B3B27] text-white text-lg sm:text-2xl font-bold text-center flex items-center justify-center shadow-[0_10px_30px_rgba(11,59,39,0.3)] hover:-translate-y-1 transition duration-200">
              Restricted Access To Global Opportunities
            </div>
          </div>

          <div className="mt-5 lg:mt-7">
            <div className="w-full p-5 sm:p-6 rounded-2xl border-2 border-[#F2C14E] bg-[#0B3B27] text-white text-lg sm:text-2xl font-bold text-center flex items-center justify-center shadow-[0_10px_30px_rgba(11,59,39,0.3)] hover:-translate-y-1 transition duration-200">
              High Banking Limitations &bull; Emotional And Unstructured Trading Decisions
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           MISSION & VISION SECTION (#mission / #system)
      ========================================================= */}
      <section id="system" className="relative w-full bg-[#082A1B] py-20 lg:py-28 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.95fr] gap-12 lg:gap-14 items-start">
            {/* Left Column */}
            <div>
              <p className="text-[#D4A72C] uppercase tracking-[4px] text-xs font-bold">
                OUR PURPOSE
              </p>

              <h3 className="mt-3 text-4xl sm:text-5xl font-black text-white">
                Mission &amp; <span className="text-[#D4A72C]">Vision</span>
              </h3>

              <p className="mt-5 max-w-xl text-white/60 text-sm sm:text-base leading-relaxed">
                We are building a next-generation decentralized ecosystem powered by AI, blockchain, and modern financial technology. Our goal is to create a secure, transparent, and scalable digital economy for users worldwide.
              </p>

              {/* Secure Ecosystem Card */}
              <div className="mt-8 rounded-[25px] bg-[#123523] border border-white/10 p-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-white flex items-center justify-center text-black">
                  <Shield className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h4 className="text-white text-xl sm:text-2xl font-bold">Secure Ecosystem</h4>
                  <p className="mt-2 text-white/50 text-xs sm:text-sm leading-relaxed">
                    Transparent systems designed with automation, trust, and decentralization at the core.
                  </p>
                </div>
              </div>

              {/* AI-Powered Growth Card */}
              <div className="mt-5 rounded-[25px] bg-[#123523] border border-white/10 p-6 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#D4A72C] flex items-center justify-center text-black">
                  <Cpu className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white text-xl sm:text-2xl font-bold">AI-Powered Growth</h4>
                  <p className="mt-2 text-white/50 text-xs sm:text-sm leading-relaxed">
                    Advanced AI-driven technology helping users access smarter financial opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Vision 2030 */}
            <div className="rounded-[28px] bg-[#0A3020] border border-[#D4A72C]/25 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold tracking-wider uppercase mb-6">
                VISION 2030
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Financial Freedom <br />
                Through <span className="text-[#D4A72C]">Technology</span>
              </h3>

              <p className="mt-5 text-white/55 text-sm sm:text-base leading-relaxed">
                Our vision is to create a globally connected decentralized financial ecosystem where communities grow together using blockchain, smart contracts, and AI automation.
              </p>

              <ul className="mt-6 space-y-3 text-white/80 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4A72C]" />
                  <span>Borderless financial access</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4A72C]" />
                  <span>Smart contract transparency</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4A72C]" />
                  <span>Community-driven ecosystem</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4A72C]" />
                  <span>Future-ready digital finance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           SYSTEM COMPARISON SECTION
      ========================================================= */}

      <section className="relative w-full bg-[#062A1B] py-16 lg:py-20 overflow-hidden border-t border-white/5">

        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.12]"
          style={{
            backgroundImage: `
        linear-gradient(rgba(212,167,44,0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,167,44,0.12) 1px, transparent 1px)
      `,
            backgroundSize: '44px 44px'
          }}
        />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10">

          {/* Heading */}
          <div className="text-center mb-12 lg:mb-14">

            <p className="text-[#D4A72C] uppercase tracking-[4px] text-[10px] sm:text-xs font-extrabold">
              SYSTEM COMPARISON
            </p>

            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-tight">
              Centralized <span className="text-white">vs</span>{' '}
              <span className="text-[#D4A72C]">
                Blockchain Automated
              </span>{' '}
              System
            </h2>

            <p className="mt-3 max-w-3xl mx-auto text-white/60 text-sm sm:text-base leading-relaxed">
              Understand the key differences between traditional centralized
              platforms and a blockchain automated platform.
            </p>

          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">

            {/* Centralized System */}
            <div className="relative min-h-[270px] sm:min-h-[290px] rounded-[20px] border border-[#D4A72C]/20 bg-[#0B4029]/95 p-5 sm:p-7 lg:p-8 overflow-hidden transition duration-300 hover:border-[#D4A72C]/40">

              <h3 className="text-center text-white text-base sm:text-lg font-black uppercase mb-6">
                CENTRALIZED SYSTEM
              </h3>

              <div className="relative z-10 space-y-3 sm:space-y-3.5 pr-16 sm:pr-24 lg:pr-28">

                {[
                  'Controlled by a central authority',
                  'Requires intermediaries',
                  'Limited transparency',
                  'Higher operational control',
                  'Data stored in one place',
                  'Slower transaction processing',
                  'Higher risk of manipulation',
                  'Geographic limitations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-white/65 text-[11px] sm:text-sm">

                    <span className="w-[15px] h-[15px] shrink-0 rounded-full bg-[#D4A72C] text-[#082A1B] flex items-center justify-center">
                      <X className="w-2.5 h-2.5 stroke-[4]" />
                    </span>

                    <span>{item}</span>

                  </div>
                ))}

              </div>

              {/* Centralized Illustration */}
              <div className="absolute right-4 sm:right-7 bottom-8 sm:bottom-10 w-[70px] sm:w-[100px] h-[100px] sm:h-[120px] flex items-center justify-center pointer-events-none">

                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Arrows */}
                  <path d="M28 49V20L19 29M28 20L37 29" stroke="#F2C14E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M60 43V10L51 19M60 10L69 19" stroke="#55BDF4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M92 49V20L83 29M92 20L101 29" stroke="#F2C14E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Network Nodes */}
                  <circle cx="40" cy="70" r="20" fill="#0D4228" stroke="#55BDF4" strokeWidth="4" />
                  <circle cx="80" cy="70" r="20" fill="#0D4228" stroke="#55BDF4" strokeWidth="4" />

                  <circle cx="40" cy="70" r="12" fill="#F2C14E" />
                  <circle cx="80" cy="70" r="12" fill="#F2C14E" />

                  <circle cx="40" cy="70" r="5" fill="#FFFFFF" />
                  <circle cx="80" cy="70" r="5" fill="#FFFFFF" />

                  <path d="M60 53V87" stroke="#F2C14E" strokeWidth="3" strokeDasharray="3 4" />
                </svg>

              </div>

            </div>

            {/* Decentralized System */}
            <div className="relative min-h-[270px] sm:min-h-[290px] rounded-[20px] border border-[#D4A72C]/30 bg-[#0B4029]/95 p-5 sm:p-7 lg:p-8 overflow-hidden transition duration-300 hover:border-[#D4A72C]/60">

              {/* OpenAid Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded-full bg-[#D4A72C]/10 border border-[#D4A72C]/30 text-[#F2C14E] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider">
                OpenAid Model
              </div>

              <h3 className="text-center text-white text-base sm:text-lg font-black uppercase mb-6">
                DECENTRALIZED SYSTEM
              </h3>

              <div className="relative z-10 space-y-3 sm:space-y-3.5 pr-16 sm:pr-24 lg:pr-28">

                {[
                  'Operates through distributed blockchain networks',
                  'Peer-to-peer structure',
                  'Transparent blockchain records',
                  'Community-driven ecosystem',
                  'Distributed ledger system',
                  'Faster global execution',
                  'Smart contract automation',
                  'Borderless participation'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-white/70 text-[11px] sm:text-sm">

                    <span className="w-[15px] h-[15px] shrink-0 rounded-full bg-[#D4A72C] text-[#082A1B] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[4]" />
                    </span>

                    <span>{item}</span>

                  </div>
                ))}

              </div>

              {/* Blockchain Illustration */}
              <div className="absolute right-4 sm:right-7 bottom-8 sm:bottom-10 w-[70px] sm:w-[100px] h-[100px] sm:h-[120px] flex items-center justify-center pointer-events-none">

                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Platform */}
                  <path d="M20 78L60 57L100 78L60 101L20 78Z" fill="#527B68" />
                  <path d="M20 78L60 100L100 78V86L60 109L20 86V78Z" fill="#244B39" />
                  <path d="M28 78L60 61L92 78L60 96L28 78Z" fill="#88AA96" />

                  {/* Globe */}
                  <circle cx="60" cy="45" r="25" fill="#6B9F42" />
                  <path d="M60 20C49 29 49 61 60 70" stroke="#B6C86B" strokeWidth="1.5" />
                  <path d="M60 20C71 29 71 61 60 70" stroke="#B6C86B" strokeWidth="1.5" />
                  <path d="M36 39C50 45 70 45 84 39" stroke="#B6C86B" strokeWidth="1.5" />
                  <path d="M38 53C51 47 69 47 82 53" stroke="#B6C86B" strokeWidth="1.5" />
                  <path d="M60 20V70M36 45H84" stroke="#D4A72C" strokeWidth="1" opacity="0.8" />

                  {/* Orbit Points */}
                  <circle cx="32" cy="29" r="2" fill="#D4A72C" />
                  <circle cx="89" cy="31" r="2" fill="#D4A72C" />
                  <circle cx="91" cy="61" r="2" fill="#D4A72C" />
                  <circle cx="30" cy="61" r="2" fill="#D4A72C" />
                </svg>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
           LEVEL INCOME SECTION (#income)
      ========================================================= */}
      <section id="income" className="relative w-full bg-black/90 py-20 lg:py-28 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Level Income
              </h2>

              <p className="mt-6 text-white/70 text-lg sm:text-xl font-normal leading-relaxed">
                Structured income flow from your network across 7 levels. Unlock deeper levels by growing your team and self-donation.
              </p>

              <div className="mt-10 p-6 rounded-2xl bg-[#0B3B27] border border-[#D4A72C]/20">
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  On every level, users receive commissions instantly with our blockchain automated integration. Your network and donation income is completely yours and no one controls it. You have access to your funds 24/7.
                </p>
              </div>
            </div>

            {/* Right: Level Progress Bars matching blade */}
            <div className="space-y-4 pt-2">
              {[
                { level: 'Level 1', pct: '8%', width: '100%' },
                { level: 'Level 2', pct: '2%', width: '70%' },
                { level: 'Level 3', pct: '2%', width: '48%' },
                { level: 'Level 4', pct: '2%', width: '28%' },
                { level: 'Level 5', pct: '2%', width: '23%' },
                { level: 'Level 6', pct: '1%', width: '10%' },
                { level: 'Level 7', pct: '1%', width: '7%' }
              ].map((lvl, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 text-white text-sm font-bold">
                    {lvl.level}
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-[#0D4228] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] shadow-[0_0_10px_rgba(212,167,44,0.5)] transition-all duration-500"
                      style={{ width: lvl.width }}
                    />
                  </div>
                  <div className="w-10 shrink-0 text-right text-[#F2C14E] text-base font-black">
                    {lvl.pct}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           OPENAID ACADEMY SECTION (#academy)
      ========================================================= */}
      <section id="academy" className="relative w-full bg-[#03150D] py-20 lg:py-28 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4A72C]/30 bg-[#D4A72C]/10 text-[#D4A72C] text-xs font-bold uppercase tracking-[4px]">
              <span className="w-2 h-2 rounded-full bg-[#D4A72C] shadow-[0_0_10px_#D4A72C]" />
              EDUCATION
            </div>

            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-white">
              OpenAid <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A72C] via-[#F2C14E] to-[#D4A72C]">Academy</span>
            </h2>

            <div className="mx-auto mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4A72C] to-transparent" />

            <p className="mt-6 max-w-3xl mx-auto text-white/60 text-base sm:text-lg leading-relaxed">
              OpenAid Academy is crypto educational training that provides members with accessible, practical learning opportunities. The Academy currently offers Beginner and Intermediate Trading Courses designed to help learners understand financial markets, technical analysis, and risk management.
            </p>
          </div>

          {/* 2 Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Beginner Course */}
            <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0D4228]/95 via-[#082A1B]/95 to-[#03150D]/95 p-6 sm:p-8 lg:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.35)] hover:border-[#D4A72C]/40 transition duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[3px] text-white/40 font-bold">COURSE 01</div>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F2C14E] to-[#D4A72C]">
                    Beginner Trading Course
                  </h3>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F2C14E] to-[#D4A72C] text-black text-xs font-black shadow-[0_0_20px_rgba(212,167,44,0.25)]">
                  FREE
                </span>
              </div>

              <div className="mt-6 h-px bg-gradient-to-r from-[#D4A72C]/30 via-white/10 to-transparent" />

              <div className="mt-6 space-y-3">
                {[
                  'Introduction to Trading',
                  'Support & Resistance',
                  'Understanding Trading Volume',
                  'Understand Market Cap',
                  'Introduction to RSI',
                  'Basic Risk Management',
                  'Good Coins vs Bad Coins'
                ].map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3.5 hover:bg-[#D4A72C]/10 transition">
                    <span className="w-8 h-8 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C] text-xs font-black">
                      0{idx + 1}
                    </span>
                    <span className="text-white/80 text-sm font-semibold">{lesson}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intermediate Course */}
            <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0D4228]/95 via-[#082A1B]/95 to-[#03150D]/95 p-6 sm:p-8 lg:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.35)] hover:border-[#D4A72C]/40 transition duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[3px] text-white/40 font-bold">COURSE 02</div>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F2C14E] to-[#D4A72C]">
                    Intermediate Trading Course
                  </h3>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F2C14E] to-[#D4A72C] text-black text-xs font-black shadow-[0_0_20px_rgba(212,167,44,0.25)]">
                  Paid $49
                </span>
              </div>

              <div className="mt-6 h-px bg-gradient-to-r from-[#D4A72C]/30 via-white/10 to-transparent" />

              <div className="mt-6 space-y-3">
                {[
                  "Best RSI Trading Strategies Most traders don't know",
                  'Exactly what to RSI buy',
                  'Exactly when to buy RSI',
                  'Exactly when to sell RSI',
                  'Building a Trading Plan'
                ].map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3.5 hover:bg-[#D4A72C]/10 transition">
                    <span className="w-8 h-8 shrink-0 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 flex items-center justify-center text-[#D4A72C] text-xs font-black">
                      0{idx + 1}
                    </span>
                    <span className="text-white/80 text-sm font-semibold">{lesson}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           CONTACT & COMMUNITY CTA SECTION (#contact)
      ========================================================= */}

      <section
        id="contact"
        className="relative w-full min-h-[480px] sm:min-h-[570px] flex items-center justify-center overflow-hidden py-10 sm:py-14 bg-[#082A1B]"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#103D29] via-[#4D4828] to-[#B87945]" />

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.12)_100%)]" />

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-[780px] mx-5 sm:mx-8">

          <div className="rounded-[26px] sm:rounded-[30px] bg-[#0B3B27] border border-[#D4A72C]/20 px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

            {/* Label */}
            <p className="text-[#D4A72C] uppercase tracking-[3px] sm:tracking-[4px] text-[10px] sm:text-xs font-bold">
              OpenAid International
            </p>

            {/* Heading */}
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.02] text-white">
              Build The Future
              <br />
              <span className="text-[#D4A72C]">
                Together.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl mx-auto text-white/60 text-xs sm:text-sm leading-relaxed">
              Join the community and explore the opportunity behind the ecosystem
            </p>

            {/* WhatsApp Button */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://chat.whatsapp.com/IfcQdPaU1Pz4QGxXDKcXkN?s=cl&p=a&mlu=4&ilr=4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join OpenAid WhatsApp Community"
                className="w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all duration-300"
              >
                <MessageCircle className="w-7 h-7" />
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
           FOOTER
      ========================================================= */}
   <Footer/>
    </div>
  );
};
