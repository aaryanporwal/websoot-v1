export type GridPoint = { x: number; y: number };

export type DijkstraGridResult = {
  distances: Float64Array;
  path: number[];
  visitedOrder: number[];
};

export type DijkstraField = {
  data: Uint8Array;
  height: number;
  path: number[];
  visitedFromEnd: number[];
  visitedFromStart: number[];
  width: number;
};

export type BidirectionalDijkstraResult = {
  distance: number;
  path: number[];
  visitedFromEnd: number[];
  visitedFromStart: number[];
};

const NEIGHBORS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

class MinHeap {
  private values: Array<{ index: number; distance: number }> = [];

  push(value: { index: number; distance: number }) {
    this.values.push(value);
    let child = this.values.length - 1;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      if (this.values[parent].distance <= value.distance) break;
      this.values[child] = this.values[parent];
      child = parent;
    }

    this.values[child] = value;
  }

  pop() {
    if (this.values.length === 0) return undefined;
    const first = this.values[0];
    const last = this.values.pop()!;
    if (this.values.length === 0) return first;

    let parent = 0;
    while (true) {
      const left = parent * 2 + 1;
      const right = left + 1;
      if (left >= this.values.length) break;
      const smaller =
        right < this.values.length &&
        this.values[right].distance < this.values[left].distance
          ? right
          : left;
      if (this.values[smaller].distance >= last.distance) break;
      this.values[parent] = this.values[smaller];
      parent = smaller;
    }

    this.values[parent] = last;
    return first;
  }

  peek() {
    return this.values[0];
  }

  get size() {
    return this.values.length;
  }
}

function hash2d(x: number, y: number, seed: number) {
  let value = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function valueNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smoothstep(x - x0);
  const ty = smoothstep(y - y0);
  const top = hash2d(x0, y0, seed) * (1 - tx) + hash2d(x0 + 1, y0, seed) * tx;
  const bottom =
    hash2d(x0, y0 + 1, seed) * (1 - tx) + hash2d(x0 + 1, y0 + 1, seed) * tx;
  return top * (1 - ty) + bottom * ty;
}

export function createTerrain(width: number, height: number, seed = 7476) {
  const terrain = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const broad = valueNoise(x / 11, y / 11, seed);
      const detail = valueNoise(x / 4.5, y / 4.5, seed + 31);
      terrain[y * width + x] = 1 + broad * 3.4 + detail * 1.2;
    }
  }

  return terrain;
}

export function runDijkstraGrid(
  terrain: ArrayLike<number>,
  width: number,
  height: number,
  start: number,
  target: number,
): DijkstraGridResult {
  const cellCount = width * height;
  const distances = new Float64Array(cellCount);
  distances.fill(Number.POSITIVE_INFINITY);
  const previous = new Int32Array(cellCount);
  previous.fill(-1);
  const settled = new Uint8Array(cellCount);
  const visitedOrder: number[] = [];
  const heap = new MinHeap();

  if (
    start < 0 ||
    target < 0 ||
    start >= cellCount ||
    target >= cellCount ||
    !Number.isFinite(terrain[start]) ||
    !Number.isFinite(terrain[target])
  ) {
    return { distances, path: [], visitedOrder };
  }

  distances[start] = 0;
  heap.push({ index: start, distance: 0 });

  while (heap.size > 0) {
    const current = heap.pop()!;
    if (
      settled[current.index] ||
      current.distance !== distances[current.index]
    ) {
      continue;
    }

    settled[current.index] = 1;
    visitedOrder.push(current.index);
    if (current.index === target) break;

    const x = current.index % width;
    const y = Math.floor(current.index / width);

    for (const [dx, dy] of NEIGHBORS) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) {
        continue;
      }

      const next = nextY * width + nextX;
      if (!Number.isFinite(terrain[next])) continue;
      const stepLength = dx === 0 || dy === 0 ? 1 : Math.SQRT2;
      const stepCost =
        stepLength * (terrain[current.index] + terrain[next]) * 0.5;
      const candidate = current.distance + stepCost;

      if (candidate < distances[next]) {
        distances[next] = candidate;
        previous[next] = current.index;
        heap.push({ index: next, distance: candidate });
      }
    }
  }

  if (!Number.isFinite(distances[target])) {
    return { distances, path: [], visitedOrder };
  }

  const path: number[] = [];
  for (let cursor = target; cursor !== -1; cursor = previous[cursor]) {
    path.push(cursor);
    if (cursor === start) break;
  }
  path.reverse();

  return { distances, path, visitedOrder };
}

function nextValidEntry(
  heap: MinHeap,
  distances: Float64Array,
  settled: Uint8Array,
) {
  while (heap.size > 0) {
    const next = heap.peek();
    if (!settled[next.index] && next.distance === distances[next.index]) {
      return next;
    }
    heap.pop();
  }
  return undefined;
}

export function runBidirectionalDijkstraGrid(
  terrain: ArrayLike<number>,
  width: number,
  height: number,
  start: number,
  target: number,
): BidirectionalDijkstraResult {
  const cellCount = width * height;
  const empty = {
    distance: Number.POSITIVE_INFINITY,
    path: [],
    visitedFromEnd: [],
    visitedFromStart: [],
  };
  if (
    start < 0 ||
    target < 0 ||
    start >= cellCount ||
    target >= cellCount ||
    !Number.isFinite(terrain[start]) ||
    !Number.isFinite(terrain[target])
  ) {
    return empty;
  }

  if (start === target) {
    return {
      distance: 0,
      path: [start],
      visitedFromEnd: [target],
      visitedFromStart: [start],
    };
  }

  const distances = [new Float64Array(cellCount), new Float64Array(cellCount)];
  const previous = [new Int32Array(cellCount), new Int32Array(cellCount)];
  const settled = [new Uint8Array(cellCount), new Uint8Array(cellCount)];
  const visited = [[], []] as [number[], number[]];
  const heaps = [new MinHeap(), new MinHeap()];
  distances[0].fill(Number.POSITIVE_INFINITY);
  distances[1].fill(Number.POSITIVE_INFINITY);
  previous[0].fill(-1);
  previous[1].fill(-1);
  distances[0][start] = 0;
  distances[1][target] = 0;
  heaps[0].push({ index: start, distance: 0 });
  heaps[1].push({ index: target, distance: 0 });

  let bestDistance = Number.POSITIVE_INFINITY;
  let meeting = -1;

  while (heaps[0].size > 0 && heaps[1].size > 0) {
    const nextForward = nextValidEntry(heaps[0], distances[0], settled[0]);
    const nextBackward = nextValidEntry(heaps[1], distances[1], settled[1]);
    if (!nextForward || !nextBackward) break;
    if (nextForward.distance + nextBackward.distance >= bestDistance) break;

    const side = nextForward.distance <= nextBackward.distance ? 0 : 1;
    const otherSide = side === 0 ? 1 : 0;
    const current = heaps[side].pop()!;
    settled[side][current.index] = 1;
    visited[side].push(current.index);

    if (Number.isFinite(distances[otherSide][current.index])) {
      const candidate = current.distance + distances[otherSide][current.index];
      if (candidate < bestDistance) {
        bestDistance = candidate;
        meeting = current.index;
      }
    }

    const x = current.index % width;
    const y = Math.floor(current.index / width);
    for (const [dx, dy] of NEIGHBORS) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) {
        continue;
      }

      const next = nextY * width + nextX;
      if (!Number.isFinite(terrain[next])) continue;
      const stepLength = dx === 0 || dy === 0 ? 1 : Math.SQRT2;
      const stepCost =
        stepLength * (terrain[current.index] + terrain[next]) * 0.5;
      const candidate = current.distance + stepCost;
      if (candidate < distances[side][next]) {
        distances[side][next] = candidate;
        previous[side][next] = current.index;
        heaps[side].push({ index: next, distance: candidate });
      }

      if (Number.isFinite(distances[otherSide][next])) {
        const joinedDistance =
          distances[side][next] + distances[otherSide][next];
        if (joinedDistance < bestDistance) {
          bestDistance = joinedDistance;
          meeting = next;
        }
      }
    }
  }

  if (meeting === -1) {
    return {
      ...empty,
      visitedFromEnd: visited[1],
      visitedFromStart: visited[0],
    };
  }

  const fromStart: number[] = [];
  for (let cursor = meeting; cursor !== -1; cursor = previous[0][cursor]) {
    fromStart.push(cursor);
    if (cursor === start) break;
  }
  fromStart.reverse();

  const toTarget: number[] = [];
  for (
    let cursor = previous[1][meeting];
    cursor !== -1;
    cursor = previous[1][cursor]
  ) {
    toTarget.push(cursor);
    if (cursor === target) break;
  }

  return {
    distance: bestDistance,
    path: [...fromStart, ...toTarget],
    visitedFromEnd: visited[1],
    visitedFromStart: visited[0],
  };
}

function normalizedPointToIndex(
  point: GridPoint,
  width: number,
  height: number,
) {
  const x = Math.round(Math.min(1, Math.max(0, point.x)) * (width - 1));
  const y = Math.round(Math.min(1, Math.max(0, point.y)) * (height - 1));
  return y * width + x;
}

export function createDijkstraField(
  width: number,
  height: number,
  destination: GridPoint,
  source: GridPoint = { x: 0.84, y: 0.72 },
): DijkstraField {
  const terrain = createTerrain(width, height);
  const start = normalizedPointToIndex(source, width, height);
  const target = normalizedPointToIndex(destination, width, height);
  const result = runBidirectionalDijkstraGrid(
    terrain,
    width,
    height,
    start,
    target,
  );
  const data = new Uint8Array(width * height * 4);
  let maxTerrain = 0;

  for (let index = 0; index < terrain.length; index++) {
    maxTerrain = Math.max(maxTerrain, terrain[index]);
  }

  result.visitedFromStart.forEach((index, order) => {
    data[index * 4] = Math.max(
      1,
      Math.round(((order + 1) / result.visitedFromStart.length) * 255),
    );
  });

  result.path.forEach((index, order) => {
    data[index * 4 + 1] = Math.max(
      1,
      Math.round(((order + 1) / result.path.length) * 255),
    );
  });

  result.visitedFromEnd.forEach((index, order) => {
    data[index * 4 + 2] = Math.max(
      1,
      Math.round(((order + 1) / result.visitedFromEnd.length) * 255),
    );
  });

  for (let index = 0; index < terrain.length; index++) {
    data[index * 4 + 3] = Math.round((terrain[index] / maxTerrain) * 255);
  }

  return {
    data,
    height,
    path: result.path,
    visitedFromEnd: result.visitedFromEnd,
    visitedFromStart: result.visitedFromStart,
    width,
  };
}
