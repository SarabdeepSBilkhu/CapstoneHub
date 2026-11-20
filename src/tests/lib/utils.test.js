/**
 * Unit tests: src/lib/utils.js
 * Tests cn() class merger and date formatters.
 */
import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatDateTime } from '@/lib/utils';

describe('cn() — class name merger', () => {
  it('merges plain strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('deduplicates conflicting tailwind classes (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('ignores falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('handles conditional object syntax', () => {
    expect(cn({ 'font-bold': true, 'text-sm': false })).toBe('font-bold');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate()', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-12-25T00:00:00.000Z');
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/2026/);
  });

  it('returns "N/A" for null', () => {
    expect(formatDate(null)).toBe('N/A');
  });

  it('returns "N/A" for undefined', () => {
    expect(formatDate(undefined)).toBe('N/A');
  });

  it('handles a Date object', () => {
    const result = formatDate(new Date('2026-01-01'));
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2026/);
  });
});

describe('formatDateTime()', () => {
  it('includes time (AM/PM or HH:MM) in output', () => {
    const result = formatDateTime('2026-06-15T14:30:00.000Z');
    // Should contain some time indicator
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('returns "N/A" for null', () => {
    expect(formatDateTime(null)).toBe('N/A');
  });
});
