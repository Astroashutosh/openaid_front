import { useEffect, useRef } from 'react';

/**
 * Custom Hook: Inactivity Auto Logout
 * Listens to user interactions and automatically executes callback on prolonged inactivity.
 * Modeled after enterprise banking & admin security standards (0 theft / 0 unauthorized session access).
 */
export const useInactivityLogout = (
  isActive: boolean,
  onLogout: () => void,
  timeoutMs: number = 15 * 60 * 1000 // 15 minutes default
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onLogout();
      }, timeoutMs);
    };

    const events = [
      'mousemove',
      'mousedown',
      'keypress',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Initial timer start
    resetTimer();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isActive, onLogout, timeoutMs]);
};
