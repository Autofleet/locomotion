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
  key?: unknown;
}

const usePolling = (
  // eslint-disable-next-line no-unused-vars
  poll: (signal: AbortSignal) => Promise<unknown>,
  {
    enabled, baseMs, maxMs = baseMs, key,
  }: PollingOptions,
): () => void => {
  const pollRef = useRef(poll);
  // Outlives the effect so that toggling `enabled` (e.g. backgrounding the app) can't reset the backoff.
  const failuresRef = useRef(0);
  const pollNowRef = useRef(noop);

  useEffect(() => {
    pollRef.current = poll;
  });

  useEffect(() => {
    if (!enabled) {
      return noop;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    const run = async () => {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        await pollRef.current(current.signal);
        if (current.signal.aborted) {
          return;
        }
        failuresRef.current = 0;
      } catch (e) {
        if (current.signal.aborted) {
          return;
        }
        failuresRef.current += 1;
      }
      timer = setTimeout(run, nextPollDelay(failuresRef.current, baseMs, maxMs));
    };

    pollNowRef.current = () => {
      clearTimeout(timer);
      failuresRef.current = 0;
      run();
    };
    run();

    return () => {
      clearTimeout(timer);
      controller?.abort();
      pollNowRef.current = noop;
    };
  }, [enabled, baseMs, maxMs, key]);

  return useCallback(() => pollNowRef.current(), []);
};

export default usePolling;
