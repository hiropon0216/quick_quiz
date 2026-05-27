import { useEffect, useMemo, useState } from "react";

interface UseTimerOptions {
  seconds: number;
  enabled?: boolean;
  onExpire: () => void;
}

export function useTimer({ seconds, enabled = true, onExpire }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          window.setTimeout(onExpire, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [enabled, onExpire]);

  return useMemo(
    () => ({
      remaining,
      progress: seconds === 0 ? 0 : (remaining / seconds) * 100,
      isUrgent: remaining <= 5,
    }),
    [remaining, seconds],
  );
}
