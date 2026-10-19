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



const testimonialVideos: TestimonialVideo[] = [
  {
    id: "story-1",
    title: "Community conversation",
    member: "Stock footage preview",
    description: "Free stock video from Pexels. Replace with an approved member testimonial before publishing.",
    videoUrl: "https://videos.pexels.com/video-files/7605721/7605721-hd_1920_1080_30fps.mp4",
    thumbnailUrl: "",
    duration: "00:09",
  },
  {
    id: "story-2",
    title: "Community discussion",
    member: "Stock footage preview",
    description: "Free stock video from Pexels. Replace with an approved member testimonial before publishing.",
    videoUrl: "https://videos.pexels.com/video-files/6517434/6517434-hd_1920_1080_30fps.mp4",
    thumbnailUrl: "",
    duration: "00:09",
  },
  {
    id: "story-3",
    title: "Team conversation",
    member: "Stock footage preview",
    description: "Free stock video from Pexels. Replace with an approved member testimonial before publishing.",
    videoUrl: "https://videos.pexels.com/video-files/8141405/8141405-uhd_3840_2160_25fps.mp4",
    thumbnailUrl: "",
    duration: "00:10",
  },

  
];



const withdrawalProofs: WithdrawalProof[] = [

  { id: "proof-1", title: "Withdrawal record", date: "Pending verification", amount: "", imageUrl: "", reference: "" },

  { id: "proof-2", title: "Withdrawal record", date: "Pending verification", amount: "", imageUrl: "", reference: "" },

  { id: "proof-3", title: "Withdrawal record", date: "Pending verification", amount: "", imageUrl: "", reference: "" },

  { id: "proof-4", title: "Withdrawal record", date: "Pending verification", amount: "", imageUrl: "", reference: "" },

];



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



const TestimonialsPage: React.FC = () => {

  const [activeTab, setActiveTab] = useState<Tab>("all");

  const videoCarousel = useCarousel(testimonialVideos.length);

  const proofCarousel = useCarousel(withdrawalProofs.length);

  const showVideos = activeTab !== "proofs";

  const showProofs = activeTab !== "videos";

  const publishedVideos = testimonialVideos.filter((item) => item.videoUrl).length;

  const publishedProofs = withdrawalProofs.filter((item) => item.imageUrl).length;



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



            <div ref={videoCarousel.trackRef} onMouseEnter={() => videoCarousel.setPaused(true)} onMouseLeave={() => videoCarousel.setPaused(false)} onFocusCapture={() => videoCarousel.setPaused(true)} onBlurCapture={() => videoCarousel.setPaused(false)} className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {testimonialVideos.map((item) => (

                <article key={item.id} data-slide className="min-w-[82%] snap-start overflow-hidden rounded-lg border border-[#1b6248]/80 bg-[linear-gradient(145deg,#073522,#042b1e)] shadow-[0_8px_24px_rgba(0,0,0,.14)] sm:min-w-[calc(50%-0.375rem)] lg:min-w-[calc(33.333%-0.5rem)]">

                  <div className="relative aspect-[2.75/1] overflow-hidden bg-gradient-to-br from-[#174A32] via-[#0B3423] to-[#041A10]">

                    {item.videoUrl ? (
                      <div className="group relative h-full w-full overflow-hidden">
                        <video
                          playsInline
                          preload="metadata"
                          poster={item.thumbnailUrl || undefined}
                          className="h-full w-full object-cover"
                          onTimeUpdate={(event) => {
                            const video = event.currentTarget;
                            const timeLabel = video.parentElement?.querySelector("[data-time-label]");
                            if (timeLabel) {
                              const remaining = Math.max(0, Math.ceil(video.duration - video.currentTime));
                              const minutes = Math.floor(remaining / 60);
                              const seconds = remaining % 60;
                              timeLabel.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                            }
                          }}
                          onPlay={(event) => {
                            const playButton = event.currentTarget.parentElement?.querySelector("[data-play-button]");
                            playButton?.classList.add("hidden");
                          }}
                          onPause={(event) => {
                            const video = event.currentTarget;
                            const playButton = video.parentElement?.querySelector("[data-play-button]");
                            if (!video.ended) playButton?.classList.remove("hidden");
                          }}
                          onEnded={(event) => {
                            const playButton = event.currentTarget.parentElement?.querySelector("[data-play-button]");
                            playButton?.classList.remove("hidden");
                          }}
                        >
                          <source src={item.videoUrl} type="video/mp4" />
                          Your browser does not support HTML video.
                        </video>

                        <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-[#062d20]/95 px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white/90">
                          <Video className="mr-1 h-2.5 w-2.5" /> Video testimonial
                        </span>

                        <button
                          type="button"
                          data-play-button
                          aria-label={`Play ${item.title}`}
                          onClick={(event) => {
                            const video = event.currentTarget.parentElement?.querySelector("video");
                            if (video) {
                              if (video.paused) {
                                void video.play();
                              } else {
                                video.pause();
                              }
                            }
                          }}
                          className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 text-[#F2C14E] transition hover:bg-black/20"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F2C14E] bg-black/35 transition hover:scale-110">
                            <span className="ml-0.5 h-0 w-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-[#F2C14E]" />
                          </span>
                        </button>

                        <span data-time-label className="pointer-events-none absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-white/90">
                          {item.duration}
                        </span>
                      </div>
                    ) : item.thumbnailUrl ? (

                      <div className="relative h-full w-full">

                        <img src={item.thumbnailUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover opacity-70" />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20"><CirclePlay className="h-9 w-9 text-[#F2C14E]" /></div>

                      </div>

                    ) : (
                      <div className="absolute inset-0 overflow-hidden bg-[#405c46]">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_68%,rgba(176,193,139,.72),transparent_22%),radial-gradient(ellipse_at_82%_34%,rgba(171,186,145,.62),transparent_25%),linear-gradient(100deg,rgba(14,46,31,.25),rgba(4,28,20,.12))]" />
                        <div className="absolute left-[3%] top-[35%] h-[48%] w-[18%] rounded-[45%] bg-[#8ca27a]/55 blur-xl" />
                        <div className="absolute right-[8%] top-[18%] h-[60%] w-[12%] rounded-full bg-[#a3b18a]/40 blur-xl" />
                        <div className="absolute left-1/2 top-[4%] h-[43%] w-[14%] -translate-x-1/2 rounded-[46%_46%_40%_40%] bg-[#061a14]/95" />
                        <div className="absolute left-1/2 bottom-0 h-[49%] w-[47%] -translate-x-1/2 rounded-t-[48%] bg-[#061a14]/95" />
                        <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-[#063323]/95 px-2 py-1 text-[7px] font-bold uppercase tracking-wide text-white/90"><Video className="mr-1 h-2.5 w-2.5" /> Video testimonial</span>
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F2C14E] bg-[#071c14]/55 text-[#F2C14E] shadow-[0_0_0_1px_rgba(0,0,0,.12)] transition hover:scale-110"><CirclePlay className="h-5 w-5 fill-[#F2C14E] text-[#F2C14E]" /></div>
                        </div>
                        <span className="absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-white/90">{item.duration}</span>
                      </div>
                    )}

                  </div>

                  <div className="p-2.5 sm:p-3">

                    <h3 className="text-[11px] font-extrabold sm:text-xs">{item.title}</h3>

                    <p className="mt-1 flex items-center gap-1 text-[9px] text-white/50"><BadgeCheck className="h-3 w-3 text-[#D4A72C]" /> {item.member}</p>

                    <p className="mt-1.5 flex items-center gap-1 text-[9px] text-[#F2C14E]/90"><Clock3 className="h-3 w-3" /> Awaiting approved content</p>

                  </div>

                </article>

              ))}

            </div>

            <div className="mt-2 flex justify-center gap-1.5">

              {testimonialVideos.map((item, index) => <button key={item.id} aria-label={`Go to member story ${index + 1}`} onClick={() => videoCarousel.goTo(index)} className={`h-1 rounded-full transition-all ${videoCarousel.activeIndex === index ? "w-6 bg-[#F2C14E]" : "w-1.5 bg-white/25"}`} />)}

            </div>

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

          </section>

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