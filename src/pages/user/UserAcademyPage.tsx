import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  PlayCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export interface AcademyCourseItem {
  id: number;
  categoryId: number;
  categoryTitle: string;
  subCategoryTitle: string;
  title: string;
  slug: string;
  description: string;
  duration?: string;
  lessonsCount: number;
  level: 'beginner' | 'intermediate';
  topics: string[];
}

export const ACADEMY_CATEGORIES = [
  {
    id: 10,
    title: 'Beginner Course',
    slug: 'beginner-course',
    subtitle: 'Essential foundational training for newly registered members and donors.',
    accentColor: '#ff9f43',
  },
  {
    id: 13,
    title: 'Intermediate Course',
    slug: 'intermediate-course',
    subtitle: 'Advanced queuing mechanics, network expansion strategies, and team leadership.',
    accentColor: '#38bdf8',
  },
];

export const ACADEMY_COURSES: AcademyCourseItem[] = [
  {
    id: 5,
    categoryId: 10,
    categoryTitle: 'Beginner Course',
    subCategoryTitle: 'Beginner Class No. 1',
    title: 'Beginner Class No. 1',
    slug: 'beginner-class-no-1',
    description: 'Introduction to the OpenAid decentralized helping platform, how peer-to-peer queue matching works, account security & non-custodial wallet setup, and how to purchase & allocate E-Pin Credits.',
    duration: '35 Mins',
    lessonsCount: 4,
    level: 'beginner',
    topics: [
      'Introduction to OpenAid Helping Platform',
      'How the 2:1 Sequential Matching System Works',
      'Account Setup & Security (Wallet, Password, 2FA)',
      'How to Buy & Use E-Pin Credits'
    ]
  },
  {
    id: 6,
    categoryId: 10,
    categoryTitle: 'Beginner Course',
    subCategoryTitle: 'Beginner Class No. 2',
    title: 'Beginner Class No. 2',
    slug: 'beginner-class-no-2',
    description: 'Master the complete step-by-step donation lifecycle: making a donation (MD), blockchain payment proof verification, receiving returns (RD), and calculating the 2:1 FIFO cycle turnover.',
    duration: '40 Mins',
    lessonsCount: 4,
    level: 'beginner',
    topics: [
      'How to Make a Donation (MD) Step by Step',
      'How to Proof Payment (Screenshot / Transaction Hash)',
      'How to Confirm & Receive Donations (RD)',
      'Understanding the 2:1 Payout Turnover Cycle'
    ]
  },
  {
    id: 7,
    categoryId: 13,
    categoryTitle: 'Intermediate Course',
    subCategoryTitle: 'Intermediate Class No. 1',
    title: 'Intermediate Class No. 1',
    slug: 'intermediate-class-no-1',
    description: 'Deep dive into ecosystem network rewards: the 18% multi-tier referral commission system across 8 levels, community leadership rank progression, reward claims, and member-to-member E-Pin transfers.',
    duration: '50 Mins',
    lessonsCount: 5,
    level: 'intermediate',
    topics: [
      'Referral Commission Structure (18% up to 8 levels)',
      'Leadership Rank Qualification & Cash Reward Rules',
      'Member-to-Member E-Pin Transfer Architecture',
      'Capital Preservation & Recommitment Discipline'
    ]
  },
  {
    id: 8,
    categoryId: 13,
    categoryTitle: 'Intermediate Course',
    subCategoryTitle: 'Intermediate Class No. 2',
    title: 'Intermediate Class No. 2',
    slug: 'intermediate-class-no-2',
    description: 'Advanced liquidity engineering: daily package velocity limits, FIFO queue priority algorithms, team duplication strategies, and expanding sustainable donor networks globally.',
    duration: '55 Mins',
    lessonsCount: 5,
    level: 'intermediate',
    topics: [
      'Daily Donation Limits & Anti-Whale Velocity Rules',
      'Queue Depth & Peer-to-Peer Matching Mechanics',
      'Duplication & High-Performance Team Growth Strategies',
      'Community Scaling & Sustainable Global Outreach'
    ]
  }
];

export const UserAcademyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Top Breadcrumb & Status Strip (Matching cs-status-strip in academy/index.blade.php) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0c2c23] border border-white/10 shadow-lg text-white">
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
          <Link
            to="/user/dashboard"
            className="text-[#ff7a1a] hover:text-[#ffa559] font-bold inline-flex items-center gap-1.5 transition-transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white/80 font-medium">OpenAid Academy</span>
          <span className="text-white/40">/</span>
          <span className="text-[#ff9f43] font-bold">Course Catalog</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span>All Courses Free to Read</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Announcement Card (Matching cs-hero-card in academy/index.blade.php) */}
      <div
        className="rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/15"
        style={{
          background: 'linear-gradient(135deg, #0c2c23 0%, #0e3228 45%, #184236 100%)',
        }}
      >
        {/* Glow circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#ff7a1a]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <span className="text-base">🎓</span>
            <span>OpenAid Academy · Digital Learning Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Level Up Your OpenAid Knowledge
          </h1>

          <p className="text-sm sm:text-base font-semibold text-[#ff9f43]">
            Professional curriculum designed to transform donors into leaders.
          </p>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Browse the latest courses published by the OpenAid Academy team. Every course is unlocked instantly for the community with free access — zero tuition or Credit required.
          </p>

          <div className="bg-black/25 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-sky-400">
              <GraduationCap className="w-5 h-5" />
              <span>Full Catalog · Lifetime Access</span>
            </div>
            <div className="font-bold text-[#ff9f43]">
              {ACADEMY_COURSES.length} Published Course(s)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Courses Grouped by Category (Matching @forelse($categories as $category) in blade) */}
      <div className="space-y-8">
        {ACADEMY_CATEGORIES.map((cat) => {
          const categoryCourses = ACADEMY_COURSES.filter((c) => c.categoryId === cat.id);

          return (
            <div key={cat.id} className="space-y-4">
              {/* Category Section Header */}
              <div className="border-b border-slate-200/80 pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: cat.accentColor }} />
                  <span>{cat.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {categoryCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-[#0c2c23] text-white rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7a1a]/50 hover:shadow-xl group"
                  >
                    {/* Header Media / Icon Banner */}
                    <div className="h-36 sm:h-40 bg-[#071914] relative flex items-center justify-center p-6 border-b border-white/10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c2c23] to-transparent opacity-80" />
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:text-[#ff7a1a] transition-all">
                          <GraduationCap className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          Free Access
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${cat.accentColor}20`,
                              color: cat.accentColor,
                            }}
                          >
                            {course.subCategoryTitle}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff9f43] transition-colors leading-snug">
                          {course.title}
                        </h4>

                        <p className="text-xs text-white/70 leading-relaxed line-clamp-3 mt-2">
                          {course.description}
                        </p>

                        {/* Curriculum Topics List */}
                        <div className="mt-3.5 space-y-1.5 pt-3 border-t border-white/10">
                          {course.topics.slice(0, 3).map((topic, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11.5px] text-white/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center gap-3">
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {course.duration}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <PlayCircle className="w-3.5 h-3.5" /> {course.lessonsCount} Lesson(s)
                          </span>
                        </div>

                        <Link
                          to={`/user/academy/course/${course.slug}`}
                          className="px-3.5 py-2 rounded-xl bg-[#ff7a1a] hover:bg-[#ea6b14] text-white font-bold text-xs shadow-md shadow-[#ff7a1a]/25 inline-flex items-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAcademyPage;
