import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { ACADEMY_COURSES } from './UserAcademyPage';

export const UserAcademyCoursePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const course =
    ACADEMY_COURSES.find((c) => c.slug === slug) ||
    ACADEMY_COURSES[0];

  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb / Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0c2c23] border border-white/10 shadow-lg text-white">
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
          <Link
            to="/user/academy"
            className="text-[#ff7a1a] hover:text-[#ffa559] font-bold inline-flex items-center gap-1.5 transition-transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> Academy Catalog
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white/80 font-medium">{course.categoryTitle}</span>
          <span className="text-white/40">/</span>
          <span className="text-[#ff9f43] font-bold">{course.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span>Enrollment Open · Free to Read</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ff7a1a]/15 border border-[#ff7a1a]/30 text-[#ff9f43]">
            <Sparkles className="w-3.5 h-3.5" /> Lifetime Access
          </span>
        </div>
      </div>

      {/* 2. Hero Course Banner */}
      <div
        className="rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/15"
        style={{
          background: 'linear-gradient(135deg, #0c2c23 0%, #0e3228 45%, #184236 100%)',
        }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#ff7a1a]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <GraduationCap className="w-4 h-4 text-[#ff9f43]" />
            <span>{course.categoryTitle} · {course.subCategoryTitle}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70 pt-2">
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-sky-400" /> Duration: {course.duration || '40 Mins'}
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <PlayCircle className="w-4 h-4 text-emerald-400" /> {course.lessonsCount} Masterclass Lessons
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Official OpenAid Curriculum
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Course Content & Lessons Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Viewer / Active Lesson Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Mock Video / Visual Header */}
            <div className="bg-[#071914] text-white p-8 sm:p-12 relative flex flex-col items-center justify-center text-center border-b border-slate-100 min-h-[260px]">
              <div className="w-16 h-16 rounded-full bg-[#ff7a1a] flex items-center justify-center shadow-lg shadow-[#ff7a1a]/40 mb-4 cursor-pointer hover:scale-110 transition-transform"
                   onClick={() => setIsPlaying(!isPlaying)}>
                <PlayCircle className="w-8 h-8 text-white fill-white ml-0.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {course.topics[activeLesson] || course.title}
              </h3>
              <p className="text-xs text-white/70 max-w-md">
                Lesson {activeLesson + 1} of {course.topics.length} · Full HD Interactive Masterclass
              </p>
              {isPlaying && (
                <div className="mt-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ▶ Streaming Session Active
                </div>
              )}
            </div>

            {/* Lesson Body */}
            <div className="p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                Lesson Overview &amp; Key Takeaways
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This comprehensive masterclass lesson delivers step-by-step guidance on {course.topics[activeLesson]}. You will learn how the platform safeguards peer transactions, how the 2:1 FIFO queuing structure allocates donations across the community, and best practices for scaling your referral network.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Key Rule to Remember:
                </div>
                <p className="leading-relaxed">
                  Every donation requires 1x package-tied E-Pin Credit and generates 162% total return upon sequential matching (2x 81%). Recommitting allows surplus unlocks to Withdrawable Profit.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => alert('Curriculum documentation downloaded.')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-600" /> Download PDF Notes
                </button>
                <Link
                  to="/user/academy"
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lessons Curriculum Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Course Syllabus ({course.topics.length} Lessons)
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Free Access
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {course.topics.map((topic, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveLesson(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-4 transition-all flex items-start gap-3.5 ${
                    activeLesson === idx
                      ? 'bg-[#ff7a1a]/[0.06] border-l-4 border-[#ff7a1a]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      activeLesson === idx
                        ? 'bg-[#ff7a1a] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Lesson {idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400">10 mins</span>
                    </div>
                    <div
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        activeLesson === idx ? 'text-slate-950 font-black' : 'text-slate-700'
                      }`}
                    >
                      {topic}
                    </div>
                  </div>

                  {activeLesson === idx ? (
                    <PlayCircle className="w-4 h-4 text-[#ff7a1a] shrink-0 mt-1" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAcademyCoursePage;
