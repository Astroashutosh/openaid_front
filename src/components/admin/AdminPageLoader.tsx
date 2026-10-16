import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AdminPageLoaderProps {
  /** Optional custom color gradient */
  gradient?: string;
}

/**
 * Enterprise Navigation Progress Loader for Admin Panel
 * - Triggers automatically on any route change (e.g. from Deposits to Withdrawals)
 * - Renders a sleek glowing gold line at the top of the screen and top of the body
 * - Shows a rapid 300ms micro-loader indicator and smooth page transition
 * - Zero impact on existing page logic, forms, modals, or state
 */
export const AdminPageLoader: React.FC<AdminPageLoaderProps> = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const isFirstRender = useRef(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all queued animation timeouts safely
  const clearTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    // Skip animation on initial page boot to prevent unnecessary flicker
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    clearTimeouts();

    // 1. Instantly start progress bar
    setVisible(true);
    setShowPill(true);
    setProgress(20);

    // 2. Rapid fluid progress steps matching YouTube / GitHub / Vercel style
    const t1 = setTimeout(() => setProgress(55), 60);
    const t2 = setTimeout(() => setProgress(85), 140);
    const t3 = setTimeout(() => setProgress(100), 240);

    // 3. Fade out and reset smoothly
    const t4 = setTimeout(() => {
      setShowPill(false);
    }, 320);

    const t5 = setTimeout(() => {
      setVisible(false);
    }, 450);

    const t6 = setTimeout(() => {
      setProgress(0);
    }, 550);

    timeoutsRef.current = [t1, t2, t3, t4, t5, t6];

    return () => {
      clearTimeouts();
    };
  }, [location.pathname, location.search]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <>
      {/* 1. VIEWPORT TOP LINE LOADER (Fixed at top of screen, z-[99999]) */}
      <div
        className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="h-[3px] bg-gradient-to-r from-amber-500 via-[#ffa800] to-orange-500 transition-all duration-200 ease-out relative"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 10px rgba(255, 168, 0, 0.8), 0 0 4px rgba(255, 168, 0, 1)',
          }}
        >
          {/* Glowing comet head at the right tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#ffa800] rounded-full blur-xs opacity-90 shadow-[0_0_12px_#ffa800]" />
        </div>
      </div>

      {/* 2. BODY SECTION TOP LINE (Pinned right below sticky header across main content) */}
      <div
        className="fixed top-16 left-0 right-0 z-30 pointer-events-none transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="h-[2px] bg-gradient-to-r from-transparent via-[#ffa800] to-transparent transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: '0 1px 6px rgba(255, 168, 0, 0.6)',
          }}
        />
      </div>

      {/* 3. QUICK MICRO-PILL INDICATOR (Floating top-right inside content area) */}
      {showPill && (
        <div className="fixed top-20 right-6 z-40 pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172b4c]/95 border border-[#ffa800]/40 shadow-xl text-white text-xs font-semibold backdrop-blur-md">
            <Loader2 className="w-3.5 h-3.5 text-[#ffa800] animate-spin" />
            <span className="text-[#ffa800] tracking-wide font-bold text-[11px] uppercase">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
};
