import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import {

  ArrowLeft,

  ArrowRight,

  ArrowUpRight,

  BadgeCheck,

  CirclePlay,

  FileImage,

  ShieldCheck,

  Video,

  Clock3,

} from "lucide-react";
import Header from "../../components/front/Header";
import Footer from "../../components/front/Footer";
import adminCMSService, { type CMSItem } from "../../services/adminCMSService";



type TestimonialVideo = {

  id: string;

  title: string;

  member: string;

  description: string;

  videoUrl?: string;

  thumbnailUrl?: string;

  duration?: string;

};



type WithdrawalProof = {

  id: string;

  title: string;

  date: string;

  amount?: string;

  imageUrl?: string;

  reference?: string;

};



type Tab = "all" | "videos" | "proofs";



function useCarousel(itemCount: number) {

  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [paused, setPaused] = useState(false);



  const getStep = () => {

    const track = trackRef.current;

    const card = track?.querySelector<HTMLElement>("[data-slide]");

    if (!track || !card) return 0;

    const style = window.getComputedStyle(track);

    const gap = Number.parseFloat(style.columnGap || style.gap || "0") || 0;

    return card.getBoundingClientRect().width + gap;

  };



  const goTo = (index: number) => {

    if (!trackRef.current || itemCount < 1) return;

    const next = (index + itemCount) % itemCount;

    trackRef.current.scrollTo({ left: getStep() * next, behavior: "smooth" });

    setActiveIndex(next);

  };



  useEffect(() => {

    const track = trackRef.current;

    if (!track) return;

    const onScroll = () => {

      const step = getStep();

      if (step) setActiveIndex(Math.min(itemCount - 1, Math.max(0, Math.round(track.scrollLeft / step))));

    };

    track.addEventListener("scroll", onScroll, { passive: true });

    return () => track.removeEventListener("scroll", onScroll);

  }, [itemCount]);



  useEffect(() => {

    if (paused || itemCount < 2) return;

    const timer = window.setInterval(() => {

      const track = trackRef.current;

      const step = getStep();

      if (!track || !step) return;

      const next = (Math.round(track.scrollLeft / step) + 1) % itemCount;

      track.scrollTo({ left: step * next, behavior: "smooth" });

      setActiveIndex(next);

    }, 6500);

    return () => window.clearInterval(timer);

  }, [itemCount, paused]);



  return { trackRef, activeIndex, goTo, move: (direction: number) => goTo(activeIndex + direction), setPaused };

}




function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") || "";
      } else {
        const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/);
        videoId = match?.[1] || "";
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube.com/embed/${videoId}`
      : null;
  } catch {
    return null;
  }
}

const TestimonialsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [testimonialVideos, setTestimonialVideos] = useState<TestimonialVideo[]>([]);
  const [withdrawalProofs, setWithdrawalProofs] = useState<WithdrawalProof[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsError, setCmsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCMSContent = async () => {
      try {
        setCmsLoading(true);
        setCmsError("");

        const items: CMSItem[] = await adminCMSService.getPublic();
        if (cancelled) return;

        const videos: TestimonialVideo[] = items
          .filter(
            (item) =>
              item.type === "testimonial" &&
            //   item.status === "published" &&
              Boolean(item.video_url)
          )
          .map((item) => ({
            id: String(item.id),
            title: item.title,
            member: item.member || "Community member",
            description: item.description || "",
            videoUrl: item.video_url || undefined,
            thumbnailUrl: item.thumbnail_url || undefined,
          }));

        const proofs: WithdrawalProof[] = items
          .filter(
            (item) =>
              item.type === "withdrawal_proof" &&
            //   item.status === "approved" &&
              Boolean(item.image_url)
          )
          .map((item) => ({
            id: String(item.id),
            title: item.title,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "Verified record",
            amount:
              item.amount !== null && item.amount !== undefined
                ? String(item.amount)
                : "",
            imageUrl: item.image_url || undefined,
            reference: item.reference || undefined,
          }));

        setTestimonialVideos(videos);
        setWithdrawalProofs(proofs);
      } catch (error) {
        if (!cancelled) {
          setCmsError(
            error instanceof Error
              ? error.message
              : "Unable to load testimonials and withdrawal proofs."
          );
        }
      } finally {
        if (!cancelled) setCmsLoading(false);
      }
    };

    void loadCMSContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const videoCarousel = useCarousel(testimonialVideos.length);
  const proofCarousel = useCarousel(withdrawalProofs.length);
  const showVideos = activeTab !== "proofs";
  const showProofs = activeTab !== "videos";
  const publishedVideos = testimonialVideos.length;
  const publishedProofs = withdrawalProofs.length;



  return (

<>

    <main className=" relative min-h-screen overflow-hidden bg-[#062719] text-white">

<Header/>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(212,167,44,.12),transparent_34%),radial-gradient(ellipse_at_95%_100%,rgba(212,167,44,.08),transparent_30%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[linear-gradient(rgba(212,167,44,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(212,167,44,.18)_1px,transparent_1px)] bg-[size:40px_40px]" />




      <div className="relative mx-auto w-full max-w-[1120px] px-4 py-3 sm:px-6 sm:py-4">

        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center gap-3 text-sm font-extrabold tracking-tight sm:text-base">
            <span className="h-px w-8 bg-[#D4A72C]" />
            <span className="inline-flex items-center gap-1.5">
              <span className="text-lg text-[#F2C14E]">🍃</span>
              <span className="text-white">Open<span className="text-[#F2C14E]">Aid</span></span>
            </span>
            <span className="h-px w-8 bg-[#D4A72C]" />
          </Link>
        </div>



        <section className="mx-auto mt-3 max-w-2xl text-center sm:mt-4">

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">

            Testimonials <span className="text-white/80">&amp;</span>{" "}

            <span className="text-[#F2C14E]">Withdrawal Proofs</span>

          </h1>

          <p className="mt-2 text-xs text-white/60 sm:text-sm">

            Member stories and independently reviewed withdrawal records.

          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">

            {([

              ["all", "All updates"],

              ["videos", "Video testimonials"],

              ["proofs", "Withdrawal proofs"],

            ] as [Tab, string][]).map(([tab, label]) => (

              <button

                key={tab}

                type="button"

                onClick={() => setActiveTab(tab)}

                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[10px] font-bold transition sm:text-xs ${

                  activeTab === tab

                    ? "border-[#F2C14E] bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] text-[#092014] shadow-[0_4px_16px_rgba(212,167,44,.2)]"

                    : "border-white/15 bg-[#082F20]/80 text-white/75 hover:border-[#D4A72C]/50"

                }`}

              >

                {tab === "videos" && <Video className="h-3.5 w-3.5" />}

                {tab === "proofs" && <FileImage className="h-3.5 w-3.5" />}

                {label}

              </button>

            ))}

          </div>

        </section>



        {cmsLoading && (
          <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/60">
            Loading testimonials and withdrawal proofs...
          </div>
        )}

        {!cmsLoading && cmsError && (
          <div className="my-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-center text-sm text-red-200">
            <p>{cmsError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-bold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {!cmsLoading && !cmsError && (
          <>
        {showVideos && (

          <section className="mt-4 sm:mt-5">

            <div className="mb-2 flex items-end justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-px w-5 bg-[#D4A72C]" />

                  <h2 className="text-sm font-extrabold sm:text-base">Member stories</h2>

                </div>

                <p className="ml-7 mt-0.5 text-[10px] text-white/50">Published with permission after review</p>

              </div>

              <div className="flex items-center gap-1.5">

                <span className="mr-1 hidden text-[10px] text-white/40 sm:inline">{publishedVideos} published</span>

                <button type="button" aria-label="Previous member stories" onClick={() => videoCarousel.move(-1)} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-white/70 hover:border-[#D4A72C]/50 hover:text-[#F2C14E]"><ArrowLeft className="h-3.5 w-3.5" /></button>

                <button type="button" aria-label="Next member stories" onClick={() => videoCarousel.move(1)} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-white/70 hover:border-[#D4A72C]/50 hover:text-[#F2C14E]"><ArrowRight className="h-3.5 w-3.5" /></button>

              </div>

            </div>



            {testimonialVideos.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/55">
                No published testimonials available yet.
              </div>
            ) : (
              <>
            <div ref={videoCarousel.trackRef} onMouseEnter={() => videoCarousel.setPaused(true)} onMouseLeave={() => videoCarousel.setPaused(false)} onFocusCapture={() => videoCarousel.setPaused(true)} onBlurCapture={() => videoCarousel.setPaused(false)} className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {testimonialVideos.map((item) => (

                <article key={item.id} data-slide className="min-w-[82%] snap-start overflow-hidden rounded-lg border border-[#1b6248]/80 bg-[linear-gradient(145deg,#073522,#042b1e)] shadow-[0_8px_24px_rgba(0,0,0,.14)] sm:min-w-[calc(50%-0.375rem)] lg:min-w-[calc(33.333%-0.5rem)]">

                  <div className="relative aspect-[2.75/1] overflow-hidden bg-gradient-to-br from-[#174A32] via-[#0B3423] to-[#041A10]">

                    {item.videoUrl ? (
                      <div className="relative h-full w-full overflow-hidden">
                        {getYouTubeEmbedUrl(item.videoUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(item.videoUrl)!}
                            title={item.title}
                            className="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        ) : (
                          <video
                            controls
                            playsInline
                            preload="metadata"
                            poster={item.thumbnailUrl || undefined}
                            className="h-full w-full object-cover"
                          >
                            <source src={item.videoUrl} />
                            Your browser does not support HTML video.
                          </video>
                        )}

                        <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-[#062d20]/95 px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white/90">
                          <Video className="mr-1 h-2.5 w-2.5" /> Video testimonial
                        </span>
                      </div>
                    ) : item.thumbnailUrl ? (
                      <div className="relative h-full w-full">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <CirclePlay className="h-9 w-9 text-[#F2C14E]" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0B3423]">
                        <div className="text-center text-white/60">
                          <Video className="mx-auto h-8 w-8" />
                          <p className="mt-2 text-xs">Video not available</p>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="p-2.5 sm:p-3">

                    <h3 className="text-[11px] font-extrabold sm:text-xs">{item.title}</h3>

                    <p className="mt-1 flex items-center gap-1 text-[9px] text-white/50"><BadgeCheck className="h-3 w-3 text-[#D4A72C]" /> {item.member}</p>

                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-[9px] leading-4 text-white/55">
                        {item.description}
                      </p>
                    )}

                  </div>

                </article>

              ))}

            </div>

            <div className="mt-2 flex justify-center gap-1.5">

              {testimonialVideos.map((item, index) => <button key={item.id} aria-label={`Go to member story ${index + 1}`} onClick={() => videoCarousel.goTo(index)} className={`h-1 rounded-full transition-all ${videoCarousel.activeIndex === index ? "w-6 bg-[#F2C14E]" : "w-1.5 bg-white/25"}`} />)}

            </div>
              </>
            )}

          </section>

        )}



        {showProofs && (

          <section className="mt-4 sm:mt-5">

            <div className="mb-2 flex items-end justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-px w-5 bg-[#D4A72C]" />

                  <h2 className="text-sm font-extrabold sm:text-base">Withdrawal proofs</h2>

                </div>

                <p className="ml-7 mt-0.5 text-[10px] text-white/50">Published only after independent review</p>

              </div>

              <div className="flex items-center gap-1.5">

                <span className="mr-1 hidden text-[10px] text-white/40 sm:inline">{publishedProofs} published</span>

                <button type="button" aria-label="Previous withdrawal proofs" onClick={() => proofCarousel.move(-1)} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-white/70 hover:border-[#D4A72C]/50 hover:text-[#F2C14E]"><ArrowLeft className="h-3.5 w-3.5" /></button>

                <button type="button" aria-label="Next withdrawal proofs" onClick={() => proofCarousel.move(1)} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-white/70 hover:border-[#D4A72C]/50 hover:text-[#F2C14E]"><ArrowRight className="h-3.5 w-3.5" /></button>

              </div>

            </div>



            {withdrawalProofs.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/55">
                No approved withdrawal proofs available yet.
              </div>
            ) : (
              <>
            <div ref={proofCarousel.trackRef} onMouseEnter={() => proofCarousel.setPaused(true)} onMouseLeave={() => proofCarousel.setPaused(false)} onFocusCapture={() => proofCarousel.setPaused(true)} onBlurCapture={() => proofCarousel.setPaused(false)} className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {withdrawalProofs.map((proof) => (

                <article key={proof.id} data-slide className="min-w-[82%] snap-start overflow-hidden rounded-lg border border-[#1b6248]/80 bg-[linear-gradient(145deg,#073522,#042b1e)] shadow-[0_8px_24px_rgba(0,0,0,.14)] sm:min-w-[calc(50%-0.375rem)] lg:min-w-[calc(33.333%-0.5rem)]">

                  <div className="flex min-h-[94px] items-center gap-3 bg-gradient-to-br from-[#0D3D29] to-[#062719] p-3 sm:min-h-[104px]">

                    {proof.imageUrl ? (

                      <a href={proof.imageUrl} target="_blank" rel="noreferrer" className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/20"><img src={proof.imageUrl} alt={proof.title} loading="lazy" className="h-full w-full object-contain" /></a>

                    ) : (

                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/[0.04] bg-[#294b38]">
                        <div className="relative flex h-10 w-8 flex-col items-start gap-[5px] rounded-[5px] bg-gradient-to-b from-[#ffe49a] to-[#e6b943] px-1.5 pt-3 shadow-[0_3px_8px_rgba(0,0,0,.2)]">
                          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-bl-sm border-b border-l border-[#b78b2d] bg-[#fff0b9]" />
                          <span className="h-[2px] w-4 rounded-full bg-[#9a7625]/75" />
                          <span className="h-[2px] w-4 rounded-full bg-[#9a7625]/75" />
                          <span className="h-[2px] w-3 rounded-full bg-[#9a7625]/75" />
                          <span className="absolute -bottom-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#294b38] bg-[#0b3525] text-[#f2c14e]"><Clock3 className="h-3.5 w-3.5" /></span>
                        </div>
                      </div>

                    )}

                    <div className="min-w-0">

                      <span className="inline-flex rounded bg-black/25 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-white/70"><FileImage className="mr-1 h-2.5 w-2.5" /> Withdrawal proof</span>

                      <h3 className="mt-2 text-[10px] font-extrabold sm:text-[11px]">{proof.title}</h3>

                      {proof.amount && <p className="mt-0.5 text-xs font-black text-[#F2C14E]">{proof.amount}</p>}

                      <p className="mt-1 flex items-center gap-1 text-[9px] text-[#F2C14E]/90"><Clock3 className="h-3 w-3" /> {proof.date}</p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 border-t border-white/[0.07] px-3 py-2 text-[8px] text-white/45">

                    <ShieldCheck className="h-3 w-3 shrink-0 text-[#D4A72C]" />

                    Published only after independent review

                    {proof.reference && <span className="truncate">· Ref: {proof.reference}</span>}

                    {proof.imageUrl && <a href={proof.imageUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex shrink-0 items-center gap-1 font-bold text-[#F2C14E]">View <ArrowUpRight className="h-3 w-3" /></a>}

                  </div>

                </article>

              ))}

            </div>

            <div className="mt-2 flex justify-center gap-1.5">

              {withdrawalProofs.map((proof, index) => <button key={proof.id} aria-label={`Go to withdrawal proof ${index + 1}`} onClick={() => proofCarousel.goTo(index)} className={`h-1 rounded-full transition-all ${proofCarousel.activeIndex === index ? "w-6 bg-[#F2C14E]" : "w-1.5 bg-white/25"}`} />)}

            </div>
              </>
            )}

          </section>

        )}



          </>
        )}

        <section className="mt-4 rounded-lg border border-white/10 bg-[#073522]/70 px-3 py-2.5 sm:mt-5 sm:px-4">

          <div className="flex items-center gap-3">

            <ShieldCheck className="h-4 w-4 shrink-0 text-[#F2C14E]" />

            <span className="h-5 w-px shrink-0 bg-[#D4A72C]/50" />

            <h2 className="shrink-0 text-[10px] font-extrabold sm:text-xs">Transparency note</h2>

            <span className="h-5 w-px shrink-0 bg-white/10" />

            <p className="text-[8px] leading-4 text-white/55 sm:text-[9px]">

              Testimonials reflect individual experiences and are not a guarantee of income or future results. Withdrawal records should be independently reviewed; personal and financial details must be hidden.

            </p>

          </div>

        </section>



        <div className="mt-4 flex justify-center">

          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4A72C] to-[#F2C14E] px-5 py-2 text-[10px] font-extrabold text-[#082015] shadow-[0_5px_18px_rgba(212,167,44,.18)] transition hover:brightness-110">

            Return to OpenAid <ArrowUpRight className="h-3 w-3" />

          </Link>

        </div>

      </div>





    </main>
   <Footer/>
</>

  );

};



export default TestimonialsPage;