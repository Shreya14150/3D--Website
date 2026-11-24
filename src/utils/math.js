/**
 * Math utilities for smooth creative coding animations
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function damp(current, target, lambda, delta) {
  return lerp(current, target, 1 - Math.exp(-lambda * delta));
}
