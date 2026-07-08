<script setup lang="ts">
import { computed } from "vue";

// Decorative, deterministic pseudo-QR rendered as SVG (not a scannable code).
// Good enough to visualise a trustmark/QR in the prototype certificate.
const props = withDefaults(defineProps<{ value: string; size?: number }>(), { size: 120 });

const GRID = 25;

// Simple deterministic hash → boolean per cell, derived from the value.
const cells = computed<boolean[][]>(() => {
  const rows: boolean[][] = [];
  let h = 2166136261;
  for (let i = 0; i < props.value.length; i++) {
    h ^= props.value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let y = 0; y < GRID; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < GRID; x++) {
      h ^= (x * 73856093) ^ (y * 19349663);
      h = Math.imul(h, 16777619);
      row.push(((h >>> 7) & 1) === 1);
    }
    rows.push(row);
  }
  return rows;
});

// Finder-pattern detection (3 corners) so it reads as a QR.
function isFinder(x: number, y: number): boolean {
  const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inBox(0, 0) || inBox(GRID - 7, 0) || inBox(0, GRID - 7);
}

function finderFilled(x: number, y: number): boolean {
  const local = (ox: number, oy: number) => {
    const lx = x - ox;
    const ly = y - oy;
    const border = lx === 0 || lx === 6 || ly === 0 || ly === 6;
    const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
    return border || core;
  };
  if (x < 7 && y < 7) return local(0, 0);
  if (x >= GRID - 7 && y < 7) return local(GRID - 7, 0);
  if (x < 7 && y >= GRID - 7) return local(0, GRID - 7);
  return false;
}
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${GRID} ${GRID}`" shape-rendering="crispEdges" class="rounded bg-white">
    <rect :width="GRID" :height="GRID" fill="white" />
    <template v-for="(row, y) in cells" :key="y">
      <template v-for="(on, x) in row" :key="x">
        <rect
          v-if="isFinder(x, y) ? finderFilled(x, y) : on"
          :x="x"
          :y="y"
          width="1"
          height="1"
          fill="#0f172a"
        />
      </template>
    </template>
  </svg>
</template>
