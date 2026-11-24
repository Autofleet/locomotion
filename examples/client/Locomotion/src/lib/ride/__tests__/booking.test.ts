import { findActiveRideOrNull, guardInFlight } from '../booking';

describe('findActiveRideOrNull', () => {
  it('returns the active ride when there is one', async () => {
    const ride = { id: 'r1', state: 'dispatched' };
    await expect(findActiveRideOrNull(async () => ride)).resolves.toBe(ride);
  });

  it('returns null when the rider has no active ride (204, empty body)', async () => {
    await expect(findActiveRideOrNull(async () => '' as unknown as null)).resolves.toBeNull();
  });

  it('returns null instead of throwing when the check fails, so booking can proceed', async () => {
    const serverError = Object.assign(new Error('Request failed with status code 500'), { response: { status: 500 } });
    await expect(findActiveRideOrNull(async () => { throw serverError; })).resolves.toBeNull();
    await expect(findActiveRideOrNull(async () => { throw new Error('Network Error'); })).resolves.toBeNull();
  });
});

describe('guardInFlight', () => {
  it('ignores a second call while the first is still running', async () => {
    let finish: () => void = () => {};
    const fn = jest.fn(() => new Promise<void>((r) => { finish = r; }));
    const guarded = guardInFlight({ current: false }, fn);

    const first = guarded();
    await guarded();
    expect(fn).toHaveBeenCalledTimes(1);

    finish();
    await first;
  });

  it('allows a new call once the previous one finished', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const guarded = guardInFlight({ current: false }, fn);
    await guarded();
    await guarded();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('releases the guard when the call throws', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined);
    const guarded = guardInFlight({ current: false }, fn);
    await expect(guarded()).rejects.toThrow('boom');
    await guarded();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
