import { describe, expect, test } from "bun:test";
import {
  createDijkstraField,
  createTerrain,
  runBidirectionalDijkstraGrid,
  runDijkstraGrid,
} from "./dijkstraField";

describe("Dijkstra field", () => {
  test("generates deterministic terrain", () => {
    expect(createTerrain(8, 5)).toEqual(createTerrain(8, 5));
    expect(createTerrain(8, 5, 1)).not.toEqual(createTerrain(8, 5, 2));
  });

  test("uses diagonal distance when it is the cheapest route", () => {
    const result = runDijkstraGrid(new Float32Array(4).fill(1), 2, 2, 0, 3);

    expect(result.path).toEqual([0, 3]);
    expect(result.distances[3]).toBeCloseTo(Math.SQRT2);
  });

  test("routes around expensive terrain", () => {
    const terrain = new Float32Array([1, 50, 1, 1, 50, 1, 1, 1, 1]);
    const result = runDijkstraGrid(terrain, 3, 3, 0, 2);

    expect(result.path).not.toContain(1);
    expect(result.path.at(-1)).toBe(2);
  });

  test("returns no path for an unreachable destination", () => {
    const terrain = new Float32Array([
      1,
      1,
      1,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      1,
      1,
      1,
    ]);
    const result = runDijkstraGrid(terrain, 3, 3, 0, 8);

    expect(result.path).toEqual([]);
    expect(result.visitedOrder).toEqual(expect.arrayContaining([0, 1, 2]));
  });

  test("bidirectional search matches the single-source shortest distance", () => {
    const terrain = createTerrain(18, 12);
    const single = runDijkstraGrid(terrain, 18, 12, 19, 196);
    const bidirectional = runBidirectionalDijkstraGrid(
      terrain,
      18,
      12,
      19,
      196,
    );

    expect(bidirectional.distance).toBeCloseTo(single.distances[196]);
    expect(bidirectional.path[0]).toBe(19);
    expect(bidirectional.path.at(-1)).toBe(196);
    expect(bidirectional.visitedFromStart.length).toBeGreaterThan(0);
    expect(bidirectional.visitedFromEnd.length).toBeGreaterThan(0);
  });

  test("packs traversal rank and ordered path into the texture", () => {
    const field = createDijkstraField(
      12,
      8,
      { x: 0.1, y: 0.2 },
      { x: 0.9, y: 0.8 },
    );
    const startTraversalCells = field.data.filter(
      (_, index) => index % 4 === 0,
    );
    const pathCells = field.data.filter((_, index) => index % 4 === 1);
    const endTraversalCells = field.data.filter((_, index) => index % 4 === 2);

    expect(field.visitedFromStart.length).toBeGreaterThan(0);
    expect(field.visitedFromEnd.length).toBeGreaterThan(0);
    expect(field.path.length).toBeGreaterThan(0);
    expect(field.path[0]).toBe(6 * 12 + 10);
    expect(field.path.at(-1)).toBe(1 * 12 + 1);
    expect(Math.max(...startTraversalCells)).toBe(255);
    expect(Math.max(...endTraversalCells)).toBe(255);
    expect(Math.max(...pathCells)).toBe(255);
  });
});
