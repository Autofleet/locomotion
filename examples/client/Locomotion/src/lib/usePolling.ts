import { useEffect, useRef } from 'react';

const JITTER_RATIO = 0.2;

export const nextPollDelay = (
  consecutiveFailures: number,
  baseMs: number,
  maxMs: number,
  random: () => number = Math.random,
): number => {
  const backedOff = Math.min(maxMs, baseMs * (2 ** consecutiveFailures));
  const jittered = backedOff * (1 - JITTER_RATIO + (2 * JITTER_RATIO * random()));
  return Math.round(Math.min(maxMs, Math.max(baseMs, jittered)));
};

interface PollingOptions {
  enabled: boolean;
  baseMs: number;
  maxMs?: number;
}

const usePolling = (
  poll: () => Promise<unknown>,
  { enabled, baseMs, maxMs = baseMs }: PollingOptions,
) => {
  const pollRef = useRef(poll);
  const inFlightRef = useRef<Promise<unknown> | null>(null);

  useEffect(() => {
    pollRef.current = poll;
  });

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;

    const run = async () => {
      try {
        if (!inFlightRef.current) {
          inFlightRef.current = pollRef.current().finally(() => {
            inFlightRef.current = null;
          });
        }
        await inFlightRef.current;
        failures = 0;
      } catch (e) {
        failures += 1;
      }
      if (!cancelled) {
        timer = setTimeout(run, nextPollDelay(failures, baseMs, maxMs));
      }
    };
    run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, baseMs, maxMs]);
};

export default usePolling;
