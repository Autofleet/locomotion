// Module-level flag: programmatic map animations suppress RidePage's onRegionChangeComplete drag handler.

let suppressed = false;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

export const beginProgrammaticAnimation = (durationMs = 800): void => {
  suppressed = true;
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    suppressed = false;
    clearTimer = null;
  }, durationMs + 200);
};

export const isProgrammaticAnimationInFlight = (): boolean => suppressed;
