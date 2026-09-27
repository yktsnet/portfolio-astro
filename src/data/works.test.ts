import { describe, it, expect } from 'vitest';
import { displayCategoryTags } from './works';

describe('displayCategoryTags', () => {
  it('orders by weight, then alphabetically, and keeps the first three', () => {
    expect(displayCategoryTags(['team', 'webui', 'chatbot', 'iot', 'finance'])).toEqual([
      'iot',
      'chatbot',
      'finance',
    ]);
  });

  it('treats undefined categories as the default weight', () => {
    expect(displayCategoryTags(['zzz', 'modernization', 'aaa'])).toEqual([
      'modernization',
      'aaa',
      'zzz',
    ]);
  });

  it('does not mutate the input', () => {
    const tags = ['team', 'iot'];
    displayCategoryTags(tags);
    expect(tags).toEqual(['team', 'iot']);
  });
});
