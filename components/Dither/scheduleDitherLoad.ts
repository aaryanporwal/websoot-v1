export const DITHER_LOAD_BUDGET_MS = 1_500;

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

  if (scheduler.requestIdleCallback && scheduler.cancelIdleCallback) {
    idleId = scheduler.requestIdleCallback(run, {
      timeout: DITHER_LOAD_BUDGET_MS,
    });
  } else {
    timeoutId = scheduler.setTimeout(run, 0);
  }

  return () => {
    if (!pending) return;
    pending = false;

    if (idleId !== undefined) scheduler.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) scheduler.clearTimeout(timeoutId);
  };
}
