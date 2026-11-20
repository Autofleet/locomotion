import { useCallback, useEffect, useRef } from 'react';

const JITTER_RATIO = 0.2;
const noop = () => undefined;

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
): () => void => {
  const pollRef = useRef(poll);
  const inFlightRef = useRef<Promise<unknown> | null>(null);
  const pollNowRef = useRef(noop);

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
    let chain = 0;

    const startPoll = () => {
      inFlightRef.current = pollRef.current().finally(() => {
        inFlightRef.current = null;
      });
      return inFlightRef.current;
    };

    const run = async (fresh = false) => {
      const myChain = chain;
      const isCurrent = () => !cancelled && myChain === chain;
      try {
        if (fresh && inFlightRef.current) {
          // The in-flight response predates the caller's reason for polling now (e.g. a cancel).
          await inFlightRef.current.catch(() => undefined);
          if (!isCurrent()) {
            return;
          }
        }
        await (inFlightRef.current || startPoll());
        if (isCurrent()) {
          failures = 0;
        }
      } catch (e) {
        if (isCurrent()) {
          failures += 1;
        }
      }
      if (isCurrent()) {
        timer = setTimeout(() => run(), nextPollDelay(failures, baseMs, maxMs));
      }
    };

    pollNowRef.current = () => {
      chain += 1;
      failures = 0;
      clearTimeout(timer);
      run(true);
    };
    run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      pollNowRef.current = noop;
    };
  }, [enabled, baseMs, maxMs]);

  return useCallback(() => pollNowRef.current(), []);
};

export default usePolling;
