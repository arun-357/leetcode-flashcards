# LeetDeck

A dark, terminal-aesthetic flashcard app for grinding LeetCode. Browse by company or pattern, flip cards to reveal solutions with syntax-highlighted Python, and track your progress.

## Demo

<video src="leetdeck.mp4" controls width="100%"></video>

## Stack

- **React 18 + Vite** — fast dev server, ESM builds
- **Chakra UI** — collapse animations, theme provider
- **react-icons** — company logo icons
- Custom **CSS design system** (`src/styles/leetdeck.css`) — JetBrains Mono, design tokens, no external UI framework for cards

## Features

- **Company decks** — Amazon, Google, Meta, Microsoft, Bloomberg, Apple; choose how many cards to draw
- **Pattern decks** — grouped by algorithm pattern (Two Pointers, Sliding Window, DP, etc.)
- **Low Level Design (LLD)** — browsable project write-ups loaded from `src/llds/`
- **Difficulty filter** — Easy / Medium / Hard chips filter the active deck without resetting your chosen count
- **Variable-height cards** — front and back cross-fade; the back expands with the solution (no fixed-height flip wrapper)
- **In-house Python highlighter** — keywords, builtins, strings, comments, function names coloured using the design system palette
- **Code block** — line gutter, copy-to-clipboard button, horizontal scroll for long lines
- **Progress indicator** — pill dots (≤ 20 cards) or compact progress bar (> 20 cards)
- **Mark Solved** — tracks solved cards per session with a green dot counter
- **Keyboard shortcuts** — `←` `→` navigate, `space` flip, `S` shuffle, `M` mark solved, `/` search

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Data

| File | Shape |
|------|-------|
| `src/data/companies.json` | `{ CompanyName: Question[] }` |
| `src/data/patterns.json`  | `{ PatternName: Question[] }` |

Each question: `{ title, slug, description, solution, category, difficulty, time_complexity, space_complexity }`.

### Updating a solution

```bash
cd src/solutionUpdate
python3 update.py --s "problem-slug" --c sol.py --j companies.json patterns.json
```

## Adding an LLD project

Drop a subfolder under `src/llds/`. A `README.md` inside becomes the Overview tab. Supported file types: `md`, `java`, `js`, `ts`, `py`, `txt`, `plantuml`. The loader picks them up at build time via `import.meta.glob` — no config needed.

## Flashcard sizing

Cards use a cross-fade (not a 3D flip) so the card height is determined by its content. Short front faces have a `min-height: 340px`; back faces with long solutions grow naturally and the **page** scrolls — the card never internally scrolls vertically. Horizontal scroll is allowed inside the code block for long lines.
