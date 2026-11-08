import { describe, expect, it } from 'vitest';
import { textWidth } from './svg-text';

describe('textWidth', () => {
  it('counts half-width characters as 0.6em', () => {
    expect(textWidth('Issue', 10)).toBeCloseTo(30);
  });

  it('counts kana, kanji and full-width symbols as 1em', () => {
    expect(textWidth('起票（AC・保証）', 10)).toBeCloseTo(10 * 7 + 6 * 2);
  });

  it('counts dashes and arrows as half-width', () => {
    expect(textWidth('— →', 10)).toBeCloseTo(18);
  });
});
