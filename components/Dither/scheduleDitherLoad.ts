/** Wait out the hero SplitText + chrome reveal before fetching Three.js. */
export const DITHER_MIN_DELAY_MS = 2_800;
/** Idle fallback after the min delay, so a busy main thread cannot stall forever. */
export const DITHER_IDLE_TIMEOUT_MS = 4_000;

export type DitherLoadScheduler = {
  setTimeout: (callback: () => void, delay: number) => number;
  clearTimeout: (id: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

function browserScheduler(): DitherLoadScheduler {
  return {
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    requestIdleCallback: window.requestIdleCallback?.bind(window),
    cancelIdleCallback: window.cancelIdleCallback?.bind(window),
  };
}

export function scheduleDitherLoad(
  load: () => void,
  scheduler: DitherLoadScheduler = browserScheduler(),
) {
  let pending = true;
  let timeoutId: number | undefined;
  let idleId: number | undefined;

  const run = () => {
    if (!pending) return;
    pending = false;
    load();
  };

  const startIdle = () => {
    if (!pending) return;

    if (scheduler.requestIdleCallback && scheduler.cancelIdleCallback) {
      idleId = scheduler.requestIdleCallback(run, {
        timeout: DITHER_IDLE_TIMEOUT_MS,
      });
      return;
    }

    timeoutId = scheduler.setTimeout(run, 0);
  };

  const delayId = scheduler.setTimeout(startIdle, DITHER_MIN_DELAY_MS);

  return () => {
    if (!pending) return;
    pending = false;

    scheduler.clearTimeout(delayId);
    if (idleId !== undefined) scheduler.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) scheduler.clearTimeout(timeoutId);
  };
}
