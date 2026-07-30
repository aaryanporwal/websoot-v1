import { describe, expect, test } from "bun:test";
import {
  DITHER_LOAD_BUDGET_MS,
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
  test("starts the coarse/no-requestIdleCallback path within the 1.5s budget", () => {
    const timer = createTimerScheduler();
    let imports = 0;

    scheduleDitherLoad(() => imports++, timer.scheduler);

    const [task] = timer.tasks.values();
    expect(task).toBeDefined();
    expect(task!.delay).toBeLessThanOrEqual(DITHER_LOAD_BUDGET_MS);

    timer.flush();
    expect(imports).toBe(1);
  });

  test("cancels a pending fallback and allows reactivation to schedule again", () => {
    const timer = createTimerScheduler();
    let imports = 0;

    const deactivate = scheduleDitherLoad(() => imports++, timer.scheduler);
    deactivate();
    timer.flush();
    expect(imports).toBe(0);
    expect(timer.cleared).toEqual([1]);

    scheduleDitherLoad(() => imports++, timer.scheduler);
    timer.flush();
    expect(imports).toBe(1);
  });

  test("retains and cancels the requestIdleCallback handle", () => {
    const cancelled: number[] = [];
    let requestedTimeout: number | undefined;
    let imports = 0;

    const scheduler: DitherLoadScheduler = {
      setTimeout: () => 1,
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
    deactivate();

    expect(requestedTimeout).toBe(DITHER_LOAD_BUDGET_MS);
    expect(cancelled).toEqual([42]);
    expect(imports).toBe(0);
  });
});
