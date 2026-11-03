export type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export const ARROW_KEYS: readonly ArrowKey[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

export function isArrowKey(key: string): key is ArrowKey {
  return (ARROW_KEYS as readonly string[]).includes(key);
}

export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Small tolerance so touching/overlapping borders don't disqualify a candidate.
const EDGE_TOLERANCE = 1;
// Off-axis distance counts more than on-axis distance, so "straight down" wins over "far to the side".
const OFF_AXIS_WEIGHT = 2;

const centerX = (r: Rect) => (r.left + r.right) / 2;
const centerY = (r: Rect) => (r.top + r.bottom) / 2;
const overlapsVertically = (a: Rect, b: Rect) =>
  b.top < a.bottom - EDGE_TOLERANCE && b.bottom > a.top + EDGE_TOLERANCE;

/**
 * Picks the index of the candidate closest to `from` in the arrow's direction (TV-remote style
 * spatial navigation). Left/Right stay within the current row; when the row ends they fall back to
 * the previous/next item in DOM order so wrapped lists (e.g. flex-wrap tags) remain reachable.
 * Returns -1 when there is nothing in that direction.
 */
export function findSpatialNeighbor(
  from: Rect,
  fromIndex: number,
  candidates: Rect[],
  key: ArrowKey,
): number {
  let bestIndex = -1;
  let bestScore = Infinity;

  candidates.forEach((rect, index) => {
    if (index === fromIndex) return;

    const dx = centerX(rect) - centerX(from);
    const dy = centerY(rect) - centerY(from);
    let primary: number;
    let secondary: number;

    switch (key) {
      case "ArrowDown":
        if (rect.top < from.bottom - EDGE_TOLERANCE) return;
        primary = dy;
        secondary = Math.abs(dx);
        break;
      case "ArrowUp":
        if (rect.bottom > from.top + EDGE_TOLERANCE) return;
        primary = -dy;
        secondary = Math.abs(dx);
        break;
      case "ArrowRight":
        if (rect.left < from.right - EDGE_TOLERANCE || !overlapsVertically(from, rect)) return;
        primary = dx;
        secondary = Math.abs(dy);
        break;
      case "ArrowLeft":
        if (rect.right > from.left + EDGE_TOLERANCE || !overlapsVertically(from, rect)) return;
        primary = -dx;
        secondary = Math.abs(dy);
        break;
    }

    const score = primary + secondary * OFF_AXIS_WEIGHT;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestIndex !== -1) return bestIndex;

  if (key === "ArrowRight" && fromIndex + 1 < candidates.length) return fromIndex + 1;
  if (key === "ArrowLeft" && fromIndex > 0) return fromIndex - 1;
  return -1;
}
