// Shared, module-level flag so that programmatic map animations from any
// component can suppress the onRegionChangeComplete handler in RidePage.
//
// react-native-maps fires onRegionChangeComplete for BOTH user drags and
// programmatic animateToRegion/fitToCoordinates calls. Without this flag
// the drag handler can't tell them apart and reverse-geocodes a region the
// user never touched, overwriting their pickup.

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
