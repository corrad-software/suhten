/**
 * Dependency-free "elastic"-style fuzzy search: multi-field, typo-tolerant,
 * relevance-ranked. Mirrors the D11 §4.2.2 "elastic search" intent (fast,
 * intuitive, fuzzy) without pulling in a real search engine.
 */

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Score how well `query` matches a single `text`, 0 (no match) … 100 (exact).
 * Tiers: exact > starts-with > word-start > contains > fuzzy subsequence.
 */
export function scoreField(query: string, text: string): number {
  const q = normalize(query);
  const t = normalize(text);
  if (!q || !t) return 0;

  if (t === q) return 100;
  if (t.startsWith(q)) return 88;

  // Any word in the text starts with the query (e.g. "petaling" in "…, Petaling Jaya").
  if (t.split(" ").some((w) => w.startsWith(q))) return 74;

  const idx = t.indexOf(q);
  if (idx >= 0) return 60 - Math.min(idx, 18); // earlier hit ranks higher

  // Fuzzy: are all query chars present in order (subsequence)? Tolerates typos
  // like missing/extra letters. Score by how compact the match span is.
  const span = subsequenceSpan(q.replace(/\s/g, ""), t.replace(/\s/g, ""));
  if (span == null) return 0;
  const compactness = q.length / span; // 1.0 = perfectly adjacent
  return Math.round(18 + compactness * 26); // 18 … 44
}

/** Length of the shortest span of `text` containing all `query` chars in order, or null. */
function subsequenceSpan(query: string, text: string): number | null {
  let qi = 0;
  let start = -1;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) {
      if (qi === 0) start = i;
      qi++;
    }
  }
  if (qi < query.length || start < 0) return null;
  // Find the end index of the last matched char.
  let end = start;
  let q = 0;
  for (let i = start; i < text.length && q < query.length; i++) {
    if (text[i] === query[q]) {
      end = i;
      q++;
    }
  }
  return end - start + 1;
}

export interface SearchField<T> {
  /** Extract the searchable string for this field. */
  get: (item: T) => string | undefined;
  /** Human label of the field, for a "matched on …" hint. */
  label: string;
  /** Relative weight (default 1). Boost primary fields like the company name. */
  weight?: number;
}

export interface SearchHit<T> {
  item: T;
  score: number;
  /** Label of the field that produced the best match. */
  matchedField: string;
}

export interface SearchOptions {
  limit?: number;
  /** Minimum combined score to include (default 20). */
  threshold?: number;
}

/**
 * Rank `items` against `query` across multiple weighted fields.
 * Returns hits sorted by relevance (best first). An empty/short query returns
 * the items in their original order (autocomplete "show all" behaviour).
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  fields: SearchField<T>[],
  opts: SearchOptions = {},
): SearchHit<T>[] {
  const { limit, threshold = 20 } = opts;
  const q = normalize(query);

  if (q.length === 0) {
    const all = items.map((item) => ({ item, score: 0, matchedField: "" }));
    return limit ? all.slice(0, limit) : all;
  }

  const hits: SearchHit<T>[] = [];
  for (const item of items) {
    let best = 0;
    let bestField = "";
    for (const f of fields) {
      const raw = f.get(item);
      if (!raw) continue;
      const s = scoreField(q, raw) * (f.weight ?? 1);
      if (s > best) {
        best = s;
        bestField = f.label;
      }
    }
    if (best >= threshold) hits.push({ item, score: best, matchedField: bestField });
  }

  hits.sort((a, b) => b.score - a.score);
  return limit ? hits.slice(0, limit) : hits;
}
