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

import { Link } from "react-router-dom";
import Footer from "../../components/front/Footer";
import Header from "../../components/front/Header";

const sections = [
  {
    title: "General Disclaimer",
    icon: FileText,
    text: "Information provided on this website is for general informational purposes only. It does not constitute financial, investment, tax, or legal advice.",
  },
  {
    title: "Donations and Financial Risks",
    icon: Wallet,
    text: "Participation in P2P donation activities involves financial risks. Matching participants and receipt of donations may be uncertain. Never commit funds you cannot afford to lose.",
  },
  {
    title: "No Guaranteed Income",
    icon: ChartNoAxesCombined,
    text: "We do not guarantee income, profits, commissions, or financial independence. Past results and examples do not guarantee future outcomes.",
  },
  {
    title: "Blockchain and Smart Contract Risks",
    icon: Layers3,
    text: "Transactions may be irreversible after confirmation. Network fees, incorrect wallet addresses, vulnerabilities, and technical issues may affect transactions.",
  },
  {
    title: "Manual and Automatic Recommitment",
    icon: RefreshCw,
    text: "Where enabled, eligible users may choose manual or automatic recommitment according to the published program rules and applicable authorization requirements.",
  },
  {
    title: "Recommitment Fees and Eligibility",
    icon: Clock3,
    text: "A five-hour recommitment window and a 5% donation-wallet charge may apply to qualifying automatic recommitments. Subscription and at least three package credits may also be required under applicable rules.",
  },
  {
    title: "Six-Times Recommitment Limit",
    icon: Layers3,
    text: "Where implemented, the six-times limit applies separately to each qualifying donation, not to the entire account. Official rules define the calculation and qualifying transactions.",
  },
  {
    title: "Withdrawal Policy",
    icon: Wallet,
    text: "Withdrawal availability, processing times, fees, and eligibility are subject to the applicable policy, technical conditions, and law.",
  },
  {
    title: "Testimonials and Withdrawal Proofs",
    icon: FileText,
    text: "Testimonials, videos, and withdrawal proofs represent individual experiences. They must not be interpreted as guarantees of similar outcomes for other users.",
  },
  {
    title: "Future Products and Platform Updates",
    icon: Globe,
    text: "Additional products and features may be introduced in the future. Planned features may require separate terms, eligibility criteria, and risk disclosures.",
  },
  {
    title: "Legal and Regulatory Notice",
    icon: Scale,
    text: "Services may not be permitted in every jurisdiction. Users should understand the laws applicable to their participation and relevant restrictions.",
  },
  {
    title: "User Responsibility and Security",
    icon: LockKeyhole,
    text: "Users are responsible for protecting passwords, private keys, and wallet credentials. Always verify transaction details and official communications.",
  },
];


export default function Disclaimer() {


  return (
    <main className="min-h-screen overflow-hidden bg-[#03140d] text-white selection:bg-[#e8b638] selection:text-black">
      {/* NAVBAR */}
  <Header/>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[#d7ae36]/20 bg-[radial-gradient(ellipse_at_82%_45%,rgba(187,143,26,0.16),transparent_36%),radial-gradient(ellipse_at_10%_85%,rgba(12,113,65,0.18),transparent_42%),#03140d]">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-96 w-96 animate-[spin_50s_linear_infinite] rounded-full border border-[#d9b03d]/15" />
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-72 w-72 rounded-full border border-[#d9b03d]/10" />
        <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(115deg,transparent_40%,rgba(218,171,43,0.025)_50%,transparent_60%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d3a92f]/40 bg-[#d3a92f]/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f0c443] shadow-[0_0_25px_rgba(211,169,47,0.05)]">
              <ShieldCheck size={15} />
              Important Information
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
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
              <span>Last updated: 13 October 2026</span>
            </div>
          </div>

          {/* CSS-only premium shield */}
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

      {/* LEGAL CARDS */}
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="group relative overflow-hidden rounded-2xl border border-[#c5a03a]/20 bg-gradient-to-br from-[#09281b]/95 to-[#04170f] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#e2b63e]/60 hover:shadow-[0_18px_45px_rgba(0,0,0,0.25),0_0_25px_rgba(223,177,47,0.05)] sm:p-7"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d8aa32]/[0.035] blur-2xl transition duration-500 group-hover:bg-[#d8aa32]/10" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e3b53b]/50 bg-gradient-to-br from-[#342b0d] to-[#0b2416] text-[#f0c64b] shadow-[inset_0_0_18px_rgba(223,178,46,0.08)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(239,194,64,0.15)]">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-[#d9b13f]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-5 text-base font-extrabold leading-6 text-white">
                  {section.title}
                </h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-400">
                  {section.text}
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
          })}
        </div>

        {/* RISK NOTICE */}
        <div className="relative mt-9 overflow-hidden rounded-2xl border border-[#d7aa30]/60 bg-[radial-gradient(ellipse_at_100%_0%,rgba(218,168,40,0.13),transparent_55%),#171909] p-6 sm:p-8">
          <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#f8dd7b] to-[#bb8413]" />
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e4b83e]/50 bg-[#e4b83e]/10 text-[#f2c74b]">
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e9bd42]">
                Important Risk Notice
              </p>
              <h3 className="mt-2 text-lg font-extrabold text-white">
                Please make informed decisions
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Do not participate solely on the basis of promotional
                statements, testimonials, or withdrawal screenshots.
                Donations and blockchain transactions involve risks, and
                financial outcomes are not guaranteed. Review applicable
                conditions and fees before committing funds.
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT CTA */}
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
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#d7a628] to-[#f4cb53] px-6 py-3.5 text-sm font-extrabold text-black shadow-[0_0_25px_rgba(221,177,50,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(221,177,50,0.2)]"
            >
              Contact Us
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
  <Footer/>
    </main>
  );
}
