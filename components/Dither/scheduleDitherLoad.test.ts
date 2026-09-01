import { describe, expect, test } from "bun:test";
import {
  DITHER_IDLE_TIMEOUT_MS,
  DITHER_MIN_DELAY_MS,
  scheduleDitherLoad,
  type DitherLoadScheduler,
} from "./scheduleDitherLoad";

function createTimerScheduler() {
  let nextId = 1;
  const tasks = new Map<number, { callback: () => void; delay: number }>();
  const cleared: number[] = [];

  const scheduler: DitherLoadScheduler = {
    setTimeout(callback, delay) {
      const id = nextId++;
      tasks.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) {
      cleared.push(id);
      tasks.delete(id);
    },
  };

  return {
    scheduler,
    tasks,
    cleared,
    flush() {
      const queued = [...tasks.values()];
      tasks.clear();
      queued.forEach(({ callback }) => callback());
    },
  };
}

describe("scheduleDitherLoad", () => {
  test("waits out the hero reveal before the idle/fallback path", () => {
    const timer = createTimerScheduler();
    let imports = 0;

    scheduleDitherLoad(() => imports++, timer.scheduler);

    const [delay] = timer.tasks.values();
    expect(delay).toBeDefined();
    expect(delay!.delay).toBe(DITHER_MIN_DELAY_MS);
    expect(imports).toBe(0);

    timer.flush();
    expect(imports).toBe(0);

    timer.flush();
    expect(imports).toBe(1);
  });

  test("cancels a pending delay and allows reactivation to schedule again", () => {
    const timer = createTimerScheduler();
    let imports = 0;

    const deactivate = scheduleDitherLoad(() => imports++, timer.scheduler);
    deactivate();
    timer.flush();
    expect(imports).toBe(0);
    expect(timer.cleared).toEqual([1]);

    scheduleDitherLoad(() => imports++, timer.scheduler);
    timer.flush();
    timer.flush();
    expect(imports).toBe(1);
  });

  test("idles after the min delay and can cancel that idle handle", () => {
    const cancelled: number[] = [];
    let requestedTimeout: number | undefined;
    let imports = 0;
    let delayCallback: (() => void) | undefined;

    const scheduler: DitherLoadScheduler = {
      setTimeout(callback) {
        delayCallback = callback;
        return 7;
      },
      clearTimeout: () => {},
      requestIdleCallback(_callback, options) {
        requestedTimeout = options.timeout;
        return 42;
      },
      cancelIdleCallback(id) {
        cancelled.push(id);
      },
    };

    const deactivate = scheduleDitherLoad(() => imports++, scheduler);
    expect(requestedTimeout).toBeUndefined();

    delayCallback?.();
    expect(requestedTimeout).toBe(DITHER_IDLE_TIMEOUT_MS);

    deactivate();
    expect(cancelled).toEqual([42]);
    expect(imports).toBe(0);
  });
});
