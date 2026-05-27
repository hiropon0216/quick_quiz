export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function pickRandom<T>(items: readonly T[], count: number): T[] {
  if (items.length <= count) {
    return shuffle(items);
  }

  const picked: T[] = [];
  const usedIndexes = new Set<number>();

  while (picked.length < count) {
    const index = Math.floor(Math.random() * items.length);
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index);
      picked.push(items[index]);
    }
  }

  return picked;
}
