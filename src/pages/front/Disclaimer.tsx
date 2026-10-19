
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Wallet,
  RefreshCw,
  Clock3,
  FileText,
  Scale,
  Globe,
  ArrowUpRight,
  LockKeyhole,
  ChartNoAxesCombined,
  Layers3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import API_ENDPOINTS from "../../config/api";
import Footer from "../../components/front/Footer";
import Header from "../../components/front/Header";

type DisclaimerSection = {
  id: number;
  section_key: string;
  label?: string;
  title: string;
  content: string;
  icon: string;
  sort_order?: number;
};

type ApiResponse = {
  success: boolean;
  data: DisclaimerSection[];
  message?: string;
};

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Wallet,
  ChartNoAxesCombined,
  Layers3,
  RefreshCw,
  Clock3,
  Scale,
  Globe,
  LockKeyhole,
  ShieldCheck,
  AlertTriangle,
};

export default function Disclaimer() {
  const [sections, setSections] = useState<DisclaimerSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDisclaimer() {
      try {
        setLoading(true);
        setLoadError("");


 const response = await fetch(API_ENDPOINTS.ADMIN.DISCLAIMER);
        const result: ApiResponse = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(
            result.message || "Could not load disclaimer content."
          );
        }

        const data = Array.isArray(result.data) ? result.data : [];

        setSections(
          [...data].sort(
            (a, b) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id
          )
        );

        setLastUpdated(
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load disclaimer content."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadDisclaimer();

    return () => controller.abort();
  }, []);

  // Database section_key se content ko alag karna
  const notices = sections.filter(
    (section) => section.section_key === "notice"
  );

  const descriptions = sections.filter(
    (section) => section.section_key === "description"
  );

  const renderCard = (
    section: DisclaimerSection,
    index: number
  ) => {
    const Icon = iconMap[section.icon] || FileText;

    return (
      <article
        key={section.id}
        className="group relative overflow-hidden rounded-2xl border border-[#c5a03a]/20 bg-gradient-to-br from-[#09281b]/95 to-[#04170f] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#e2b63e]/60 hover:shadow-[0_18px_45px_rgba(0,0,0,0.25),0_0_25px_rgba(223,177,47,0.05)] sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d8aa32]/[0.035] blur-2xl transition duration-500 group-hover:bg-[#d8aa32]/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e3b53b]/50 bg-gradient-to-br from-[#342b0d] to-[#0b2416] text-[#f0c64b] shadow-[inset_0_0_18px_rgba(223,178,46,0.08)] transition duration-300 group-hover:scale-105">
            <Icon size={25} strokeWidth={1.7} />
          </div>

          <span className="font-mono text-xs font-bold tracking-widest text-[#d9b13f]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {section.label && (
          <p className="relative mt-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e8bb40]">
            {section.label}
          </p>
        )}

        <h3 className="relative mt-5 text-base font-extrabold leading-6 text-white">
          {section.title}
        </h3>

        <p className="relative mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-400">
          {section.content}
        </p>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-[#c9a034]/35 to-transparent" />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            OpenAid · Legal
          </span>

          <ArrowUpRight
            size={16}
            className="text-[#dcb43d] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#03140d] text-white selection:bg-[#e8b638] selection:text-black">
      <Header />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[#d7ae36]/20 bg-[radial-gradient(ellipse_at_82%_45%,rgba(187,143,26,0.16),transparent_36%),radial-gradient(ellipse_at_10%_85%,rgba(12,113,65,0.18),transparent_42%),#03140d]">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-96 w-96 animate-[spin_50s_linear_infinite] rounded-full border border-[#d9b03d]/15" />

        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-72 w-72 rounded-full border border-[#d9b03d]/10" />

        <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(115deg,transparent_40%,rgba(218,171,43,0.025)_50%,transparent_60%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d3a92f]/40 bg-[#d3a92f]/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f0c443]">
              <ShieldCheck size={15} />
              Important Information
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Disclaimer
              <span className="mt-3 block bg-gradient-to-r from-[#f8df85] via-[#e9b632] to-[#bd8613] bg-clip-text text-3xl text-transparent sm:text-4xl lg:text-5xl">
                OpenAid International
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Transparency starts with understanding. Review the risks,
              donation policies, recommitment conditions, withdrawal rules,
              and responsibilities associated with our platform.
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-slate-400">
              <FileText size={17} className="text-[#edbf40]" />
              <span>Last updated: {lastUpdated || "—"}</span>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center">
            <div className="absolute inset-0 animate-[spin_35s_linear_infinite] rounded-full border border-[#d9ad34]/25" />
            <div className="absolute inset-5 rounded-full border border-[#d9ad34]/15" />
            <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(217,169,42,0.22),rgba(7,52,31,0.14)_52%,transparent_72%)]" />

            <div className="relative flex h-40 w-40 animate-[bounce_5s_ease-in-out_infinite] items-center justify-center rounded-[32px] border border-[#e8bb41]/50 bg-gradient-to-br from-[#123c29] to-[#030d08] shadow-[0_0_70px_rgba(224,177,48,0.15),inset_0_0_35px_rgba(224,177,48,0.06)] sm:h-48 sm:w-48">
              <ShieldCheck
                size={100}
                strokeWidth={1.15}
                className="text-[#efc44b] drop-shadow-[0_0_20px_rgba(231,184,53,0.4)]"
              />
            </div>

            <div className="absolute bottom-3 rounded-full border border-[#e4b839]/30 bg-[#091e13]/90 px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-[#e9be45] backdrop-blur-xl sm:text-[10px]">
              Trust · Transparency · Responsibility
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Disclaimer Content */}
      <section className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#edbf40]">
            <span className="h-px w-8 bg-[#edbf40]" />
            Key Information
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Important <span className="text-[#e8b638]">Terms & Notices</span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Understand the platform rules, applicable conditions, and
            potential risks before participating.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#c5a03a]/20 bg-[#09281b] p-8 text-center text-slate-300">
            Loading disclaimer content…
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center text-red-200">
            {loadError}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {descriptions.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {descriptions.map((section, index) =>
                  renderCard(section, index)
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#c5a03a]/20 bg-[#09281b] p-8 text-center text-slate-300">
                No description sections available.
              </div>
            )}

            {/* Dynamic Important Risk Notices */}
            {notices.map((notice) => {
              const NoticeIcon = iconMap[notice.icon] || AlertTriangle;

              return (
                <div
                  key={notice.id}
                  className="relative mt-9 overflow-hidden rounded-2xl border border-[#d7aa30]/60 bg-[radial-gradient(ellipse_at_100%_0%,rgba(218,168,40,0.13),transparent_55%),#171909] p-6 sm:p-8"
                >
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#f8dd7b] to-[#bb8413]" />

                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e4b83e]/50 bg-[#e4b83e]/10 text-[#f2c74b] sm:h-14 sm:w-14">
                      <NoticeIcon size={27} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e9bd42]">
                        {notice.label || "Important Risk Notice"}
                      </p>

                      <h3 className="mt-2 text-lg font-extrabold text-white">
                        {notice.title}
                      </h3>

                      <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-300">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {sections.length === 0 && (
              <div className="mt-5 rounded-2xl border border-[#c5a03a]/20 bg-[#09281b] p-6 text-center text-slate-300">
                No active disclaimer sections found.
              </div>
            )}
          </>
        )}

        {/* Contact Section */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-800/70 bg-gradient-to-r from-[#09291b] via-[#071c13] to-[#10281a] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-24 h-56 w-56 rounded-full border border-[#dcb337]/15" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#e8bb40]" size={26} />
                <h3 className="text-xl font-extrabold">
                  Need More Information?
                </h3>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Contact our team if you have questions about this disclaimer,
                program rules, or applicable policies.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#d7a628] to-[#f4cb53] px-6 py-3.5 text-sm font-extrabold text-black shadow-[0_0_25px_rgba(221,177,50,0.12)] transition duration-300 hover:-translate-y-0.5"
            >
              Contact Us <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
