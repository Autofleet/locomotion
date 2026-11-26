import React from 'react';
import renderer, { act } from 'react-test-renderer';
import usePolling, { nextPollDelay } from '../usePolling';

const BASE = 4000;
const MAX = 60000;

describe('nextPollDelay', () => {
  it('stays at the base interval while polls succeed', () => {
    expect(nextPollDelay(0, BASE, MAX, () => 0.5)).toBe(BASE);
  });

  it('doubles per consecutive failure and caps at max', () => {
    expect(nextPollDelay(1, BASE, MAX, () => 0.5)).toBe(8000);
    expect(nextPollDelay(3, BASE, MAX, () => 0.5)).toBe(32000);
    expect(nextPollDelay(10, BASE, MAX, () => 1)).toBe(MAX);
  });

  it('jitters by up to 20% without leaving [base, max]', () => {
    expect(nextPollDelay(2, BASE, MAX, () => 0)).toBe(12800);
    expect(nextPollDelay(2, BASE, MAX, () => 1)).toBe(19200);
    expect(nextPollDelay(0, BASE, MAX, () => 0)).toBe(BASE);
  });
});

describe('usePolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const Poller = ({ poll, enabled }: { poll: (signal: AbortSignal) => Promise<unknown>; enabled: boolean }) => {
    usePolling(poll, { enabled, baseMs: BASE, maxMs: MAX });
    return null;
  };

  const flush = () => act(async () => { await Promise.resolve(); });

  it('never starts a poll while the previous one is unresolved', async () => {
    let resolve: () => void = () => {};
    const poll = jest.fn(() => new Promise<void>((r) => { resolve = r; }));
    await act(async () => { renderer.create(<Poller poll={poll} enabled />); });
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { jest.advanceTimersByTime(30000); });
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { resolve(); });
    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(2);
  });

  it('backs off after failures and resets after a success', async () => {
    const poll = jest.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined);
    await act(async () => { renderer.create(<Poller poll={poll} enabled />); });
    await flush();
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { jest.advanceTimersByTime(7999); });
    expect(poll).toHaveBeenCalledTimes(1);
    await act(async () => { jest.advanceTimersByTime(1); });
    await flush();
    expect(poll).toHaveBeenCalledTimes(2);

    await act(async () => { jest.advanceTimersByTime(16000); });
    await flush();
    expect(poll).toHaveBeenCalledTimes(3);

    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(4);
  });

  it('stops when disabled and polls immediately when re-enabled', async () => {
    const poll = jest.fn().mockResolvedValue(undefined);
    let tree: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<Poller poll={poll} enabled />); });
    await act(async () => { tree.update(<Poller poll={poll} enabled={false} />); });
    await act(async () => { jest.advanceTimersByTime(MAX); });
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { tree.update(<Poller poll={poll} enabled />); });
    expect(poll).toHaveBeenCalledTimes(2);
  });

  it('keeps the backoff across disable/enable instead of resetting it', async () => {
    const poll = jest.fn().mockRejectedValue(new Error('boom'));
    let tree: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<Poller poll={poll} enabled />); });
    await flush();
    await act(async () => { tree.update(<Poller poll={poll} enabled={false} />); });
    await act(async () => { tree.update(<Poller poll={poll} enabled />); });
    await flush();
    expect(poll).toHaveBeenCalledTimes(2);

    await act(async () => { jest.advanceTimersByTime(15999); });
    expect(poll).toHaveBeenCalledTimes(2);
    await act(async () => { jest.advanceTimersByTime(1); });
    expect(poll).toHaveBeenCalledTimes(3);
  });

  it('pollNow resets backoff and polls immediately', async () => {
    const poll = jest.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined);
    let pollNow: () => void = () => {};
    const Capture = () => {
      pollNow = usePolling(poll, { enabled: true, baseMs: BASE, maxMs: MAX });
      return null;
    };
    await act(async () => { renderer.create(<Capture />); });
    await act(async () => { jest.advanceTimersByTime(8000); });
    await flush();
    expect(poll).toHaveBeenCalledTimes(2);

    await act(async () => { pollNow(); });
    expect(poll).toHaveBeenCalledTimes(3);
    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(4);
  });

  const abortablePoll = () => {
    const signals: AbortSignal[] = [];
    const poll = jest.fn((signal: AbortSignal) => new Promise<void>((resolve, reject) => {
      signals.push(signal);
      signal.addEventListener('abort', () => reject(new Error('canceled')));
    }));
    return { poll, signals };
  };

  it('pollNow aborts the in-flight poll and polls fresh right away, without counting the abort as a failure', async () => {
    const { poll, signals } = abortablePoll();
    let pollNow: () => void = () => {};
    const Capture = () => {
      pollNow = usePolling(poll, { enabled: true, baseMs: BASE, maxMs: MAX });
      return null;
    };
    await act(async () => { renderer.create(<Capture />); });
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    await act(async () => { pollNow(); });
    expect(poll).toHaveBeenCalledTimes(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
    expect(setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms > 0)).toHaveLength(0);
  });

  it('aborts the in-flight poll when disabled, and a late result from it schedules nothing', async () => {
    let resolveFirst: () => void = () => {};
    const signals: AbortSignal[] = [];
    const poll = jest.fn((signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<void>((r) => { if (signals.length === 1) resolveFirst = r; });
    });
    let tree: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<Poller poll={poll} enabled />); });
    await act(async () => { tree.update(<Poller poll={poll} enabled={false} />); });
    expect(signals[0].aborted).toBe(true);

    await act(async () => { resolveFirst(); });
    await act(async () => { jest.advanceTimersByTime(MAX); });
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it('a key change aborts the old poll and restarts for the new key', async () => {
    const { poll, signals } = abortablePoll();
    const Keyed = ({ id }: { id: string }) => {
      usePolling(poll, {
        enabled: true, baseMs: BASE, maxMs: MAX, key: id,
      });
      return null;
    };
    let tree: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<Keyed id="a" />); });
    await act(async () => { tree.update(<Keyed id="b" />); });
    expect(poll).toHaveBeenCalledTimes(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });
});
