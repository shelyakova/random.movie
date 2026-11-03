import { describe, expect, it } from "vitest";
import { findSpatialNeighbor, isArrowKey, Rect } from "./spatial-navigation";

const rect = (left: number, top: number, width = 80, height = 30): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
});

// Two rows of wrapped tags:
// [0] [1] [2]
// [3]   [4]
const tags = [rect(0, 0), rect(90, 0), rect(180, 0), rect(0, 40), rect(120, 40)];

describe("findSpatialNeighbor", () => {
  it("moves right/left within a row", () => {
    expect(findSpatialNeighbor(tags[0], 0, tags, "ArrowRight")).toBe(1);
    expect(findSpatialNeighbor(tags[2], 2, tags, "ArrowLeft")).toBe(1);
  });

  it("wraps to the next/previous item in DOM order at the row edge", () => {
    expect(findSpatialNeighbor(tags[2], 2, tags, "ArrowRight")).toBe(3);
    expect(findSpatialNeighbor(tags[3], 3, tags, "ArrowLeft")).toBe(2);
  });

  it("moves down/up to the horizontally closest item", () => {
    expect(findSpatialNeighbor(tags[0], 0, tags, "ArrowDown")).toBe(3);
    expect(findSpatialNeighbor(tags[2], 2, tags, "ArrowDown")).toBe(4);
    expect(findSpatialNeighbor(tags[4], 4, tags, "ArrowUp")).toBe(1);
  });

  it("returns -1 when there is nothing in that direction", () => {
    expect(findSpatialNeighbor(tags[0], 0, tags, "ArrowUp")).toBe(-1);
    expect(findSpatialNeighbor(tags[3], 3, tags, "ArrowDown")).toBe(-1);
    expect(findSpatialNeighbor(tags[0], 0, tags, "ArrowLeft")).toBe(-1);
    expect(findSpatialNeighbor(tags[4], 4, tags, "ArrowRight")).toBe(-1);
  });

  it("finds items below even when they are scrolled out of view", () => {
    const list = [rect(0, 0), rect(0, 1000)];
    expect(findSpatialNeighbor(list[0], 0, list, "ArrowDown")).toBe(1);
  });
});

describe("isArrowKey", () => {
  it("recognises only arrow keys", () => {
    expect(isArrowKey("ArrowDown")).toBe(true);
    expect(isArrowKey("Enter")).toBe(false);
  });
});
