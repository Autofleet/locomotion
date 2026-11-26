import React from 'react';
import renderer, { act } from 'react-test-renderer';
import useSingleFlight from '../useSingleFlight';

const setup = (fn: () => Promise<void>) => {
  const result: { guarded: () => Promise<void> } = { guarded: async () => undefined };
  const Capture = () => {
    result.guarded = useSingleFlight(fn);
    return null;
  };
  let tree: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<Capture />); });
  const rerender = () => act(() => { tree.update(<Capture />); });
  return { result, rerender };
};

describe('useSingleFlight', () => {
  it('ignores a second call while the first is still running, even from a later render', async () => {
    let finish: () => void = () => {};
    const fn = jest.fn(() => new Promise<void>((r) => { finish = r; }));
    const { result, rerender } = setup(fn);

    const first = result.guarded();
    rerender();
    await result.guarded();
    expect(fn).toHaveBeenCalledTimes(1);

    finish();
    await first;
  });

  it('allows a new call once the previous one finished', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const { result } = setup(fn);
    await result.guarded();
    await result.guarded();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('releases the guard when the call throws', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined);
    const { result } = setup(fn);
    await expect(result.guarded()).rejects.toThrow('boom');
    await result.guarded();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
