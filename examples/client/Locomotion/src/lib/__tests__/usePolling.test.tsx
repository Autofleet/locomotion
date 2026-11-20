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

  const Poller = ({ poll, enabled }: { poll: () => Promise<unknown>; enabled: boolean }) => {
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

  it('with immediate: false, waits one interval before the first poll', async () => {
    const poll = jest.fn().mockResolvedValue(undefined);
    const Delayed = () => {
      usePolling(poll, {
        enabled: true, baseMs: BASE, maxMs: MAX, immediate: false,
      });
      return null;
    };
    await act(async () => { renderer.create(<Delayed />); });
    expect(poll).not.toHaveBeenCalled();
    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(1);
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

  it('pollNow during an in-flight poll waits for it, then polls fresh on a single schedule', async () => {
    const resolvers: Array<() => void> = [];
    const poll = jest.fn(() => new Promise<void>((r) => { resolvers.push(r); }));
    let pollNow: () => void = () => {};
    const Capture = () => {
      pollNow = usePolling(poll, { enabled: true, baseMs: BASE, maxMs: MAX });
      return null;
    };
    await act(async () => { renderer.create(<Capture />); });
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    await act(async () => { pollNow(); });
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { resolvers[0](); });
    expect(poll).toHaveBeenCalledTimes(2);

    await act(async () => { resolvers[1](); });
    expect(setTimeoutSpy.mock.calls.filter(([, ms]) => ms === BASE)).toHaveLength(1);
    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(3);
  });

  it('does not double up when re-enabled while a poll is still in flight', async () => {
    let resolve: () => void = () => {};
    const poll = jest.fn(() => new Promise<void>((r) => { resolve = r; }));
    let tree: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<Poller poll={poll} enabled />); });
    await act(async () => { tree.update(<Poller poll={poll} enabled={false} />); });
    await act(async () => { tree.update(<Poller poll={poll} enabled />); });
    expect(poll).toHaveBeenCalledTimes(1);

    await act(async () => { resolve(); });
    await act(async () => { jest.advanceTimersByTime(BASE); });
    expect(poll).toHaveBeenCalledTimes(2);
  });
});
