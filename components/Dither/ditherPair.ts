export type DitherPoint = { x: number; y: number };
export type DitherPair = {
  start: DitherPoint | null;
  end: DitherPoint | null;
  token: number;
};

export const EMPTY_DITHER_PAIR: DitherPair = {
  start: null,
  end: null,
  token: 0,
};

export function clickDitherPair(
  pair: DitherPair,
  point: DitherPoint,
): DitherPair {
  return pair.start && !pair.end
    ? { ...pair, end: point, token: pair.token + 1 }
    : { start: point, end: null, token: pair.token + 1 };
}

export function forgetFinishedDitherPair(pair: DitherPair): DitherPair {
  return pair.end ? { start: null, end: null, token: pair.token } : pair;
}

export function shouldStartDitherInteraction(
  token: number,
  previousToken: number,
  hasStart: boolean,
  width: number,
  height: number,
) {
  return (
    token > 0 && token !== previousToken && hasStart && width > 0 && height > 0
  );
}
