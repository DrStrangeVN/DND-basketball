// Lightweight fuzzy search — replaces fuse.js (~35KB) with ~1KB.
// Scores entries by weighted field matches; supports typo-tolerant subsequence matching.
export interface Searchable {
  title: string;
  description: string;
  tags: string[];
  hub: string;
}

function norm(s: string): string {
  return s.toLowerCase().trim();
}

// Returns a match score (higher = better), or 0 for no match.
// Matches if every query word appears (as substring or subsequence) in the haystack.
function wordScore(hay: string, word: string): number {
  if (hay.includes(word)) return word.length * 2; // exact substring: strong
  // subsequence (typo-tolerant): all chars of word appear in order in hay
  let hi = 0;
  for (let wi = 0; wi < word.length; wi++) {
    hi = hay.indexOf(word[wi], hi);
    if (hi === -1) return 0;
    hi++;
  }
  return word.length; // subsequence: weaker
}

export function fuzzySearch<T extends Searchable>(index: T[], query: string, limit = 8): T[] {
  const words = norm(query).split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return [];
  const scored: { item: T; score: number }[] = [];
  for (const item of index) {
    const title = norm(item.title);
    const tags = norm(item.tags.join(" "));
    const desc = norm(item.description);
    const hub = norm(item.hub);
    let total = 0;
    let matchedAll = true;
    for (const w of words) {
      const ts = wordScore(title, w);
      const gs = wordScore(tags, w);
      const ds = wordScore(desc, w);
      const hs = wordScore(hub, w);
      const best = Math.max(ts * 5, gs * 2.5, ds * 1, hs * 1.5);
      if (best === 0) { matchedAll = false; break; }
      total += best;
    }
    if (matchedAll) {
      // bonus for title prefix match
      if (title.startsWith(words[0])) total += 20;
      scored.push({ item, score: total });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
