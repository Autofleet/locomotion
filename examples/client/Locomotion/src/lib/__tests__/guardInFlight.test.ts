import guardInFlight from '../guardInFlight';

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
