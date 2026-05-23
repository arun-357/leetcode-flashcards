import { useState, useMemo, useEffect, useRef } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────

function catClass(name) {
  const k = name.toLowerCase();
  if (k.includes('array') || k.includes('two pointer') || k.includes('sliding'))  return 'c-arrays';
  if (k.includes('hash') || k.includes('map'))   return 'c-hash';
  if (k.includes('stack'))                        return 'c-stack';
  if (k.includes('string'))                       return 'c-string';
  if (k.includes('linked'))                       return 'c-linked';
  if (k.includes('recursion'))                    return 'c-recursion';
  if (k.includes('dynamic') || k === 'dp' || k.includes(' dp')) return 'c-dp';
  if (k.includes('sort') || k.includes('interval')) return 'c-sorting';
  if (k.includes('graph') || k.includes('network')) return 'c-graph';
  if (k.includes('dfs') || k.includes('bfs') || k.includes('tree') || k.includes('binary search')) return 'c-dfs';
  if (k.includes('topo'))  return 'c-topo';
  if (k.includes('heap') || k.includes('priority')) return 'c-heap';
  if (k.includes('design')) return 'c-design';
  return '';
}

function parseCategories(category) {
  if (!category) return [];
  return category.split(/[,/]/).map(s => s.trim()).filter(Boolean);
}

// Normalise "EASY" / "Easy" / "easy" → "Easy" | "Medium" | "Hard"
function normalizeDifficulty(d) {
  if (!d) return null;
  const l = d.toLowerCase();
  if (l === 'easy')   return 'Easy';
  if (l === 'medium') return 'Medium';
  if (l === 'hard')   return 'Hard';
  return null;
}

function diffChipClass(normalised) {
  if (normalised === 'Easy')   return 'ld-chip-easy';
  if (normalised === 'Medium') return 'ld-chip-medium';
  if (normalised === 'Hard')   return 'ld-chip-hard';
  return 'ld-chip-cat';
}

function FilterBar({ difficulty, setDifficulty, counts }) {
  const items = [
    { key: 'all',    label: `All (${counts.all})`,       cls: 'all'    },
    { key: 'Easy',   label: `Easy (${counts.Easy})`,     cls: 'easy'   },
    { key: 'Medium', label: `Medium (${counts.Medium})`, cls: 'medium' },
    { key: 'Hard',   label: `Hard (${counts.Hard})`,     cls: 'hard'   },
  ];
  return (
    <div className="ld-filter-bar">
      <span className="ld-filter-label">DIFFICULTY</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {items.map(it => (
          <button
            key={it.key}
            className={`ld-fchip ${difficulty === it.key ? `active ${it.cls}` : ''}`}
            onClick={() => setDifficulty(it.key)}
          >
            {it.key !== 'all' && (
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor', flexShrink: 0 }} />
            )}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const KBD = ({ children }) => (
  <kbd style={{
    border: '1px solid var(--line-2)',
    background: 'var(--bg-inset)',
    padding: '1px 5px',
    borderRadius: 3,
    color: 'var(--fg-1)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    marginRight: 5,
  }}>
    {children}
  </kbd>
);

// ── Python syntax highlighter ─────────────────────────────────────────────────

const PY_KEYWORDS = new Set([
  'class', 'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in',
  'not', 'and', 'or', 'is', 'True', 'False', 'None', 'lambda', 'from',
  'import', 'as', 'with', 'try', 'except', 'raise', 'pass', 'break',
  'continue', 'yield', 'global', 'nonlocal', 'self',
]);
const PY_BUILTINS = new Set([
  'int', 'str', 'bool', 'float', 'list', 'dict', 'set', 'tuple', 'len',
  'range', 'enumerate', 'print', 'min', 'max', 'sum', 'abs', 'sorted',
  'map', 'filter', 'zip', 'any', 'all', 'type', 'isinstance', 'ListNode',
  'List', 'TreeNode', 'Optional',
]);

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(src) {
  const re = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b\d+(?:\.\d+)?\b|->|[A-Za-z_][A-Za-z0-9_]*|[^\sA-Za-z0-9_])/g;
  let out = '', last = 0, prev = '', m;
  while ((m = re.exec(src)) !== null) {
    out += escapeHTML(src.slice(last, m.index));
    const t = m[0];
    let cls = '';
    if (t.startsWith('#'))              cls = 'tk-comment';
    else if (t.startsWith('"') || t.startsWith("'")) cls = 'tk-string';
    else if (/^\d/.test(t))            cls = 'tk-number';
    else if (t === '->')               cls = 'tk-arrow';
    else if (PY_KEYWORDS.has(t))       cls = 'tk-keyword';
    else if (PY_BUILTINS.has(t))       cls = 'tk-builtin';
    else if (/^[A-Za-z_]/.test(t) && prev === 'def')   cls = 'tk-funcname';
    else if (/^[A-Za-z_]/.test(t) && prev === 'class') cls = 'tk-classname';
    if (cls) out += `<span class="${cls}">${escapeHTML(t === '->' ? '→' : t)}</span>`;
    else out += escapeHTML(t);
    if (/^[A-Za-z_]/.test(t) || t === 'def' || t === 'class') prev = t;
    last = m.index + t.length;
  }
  return out + escapeHTML(src.slice(last));
}

function CodeBlock({ source }) {
  const [copied, setCopied] = useState(false);
  const lines = source.split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();

  function copy(e) {
    e.stopPropagation();
    navigator.clipboard?.writeText(source).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="ld-codeblock" onClick={e => e.stopPropagation()}>
      <button className="ld-codeblock-copy" onClick={copy} aria-label="Copy code" title={copied ? 'Copied' : 'Copy'}>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        )}
      </button>
      <div className="ld-codeblock-scroll">
        <div className="ld-codeblock-gutter" aria-hidden="true">
          {lines.map((_, i) => <div key={i} className="ld-codeblock-ln">{i + 1}</div>)}
        </div>
        <pre className="ld-codeblock-pre">
          <code dangerouslySetInnerHTML={{ __html: highlightPython(lines.join('\n')) }} />
        </pre>
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

const DOT_LIMIT = 20;

function DeckMeta({ index, total, solvedSet }) {
  const showDots = total <= DOT_LIMIT;

  return (
    <div className="ld-deck-meta">
      <div>
        Card{' '}
        <span className="n">{String(index + 1).padStart(2, '0')}</span>
        {' '}/ {String(total).padStart(2, '0')}
      </div>

      {showDots ? (
        <div className="ld-dots">
          {Array.from({ length: total }).map((_, i) => {
            let cls = 'ld-dot';
            if (i === index)          cls += ' current';
            else if (solvedSet.has(i)) cls += ' done';
            return <span key={i} className={cls} />;
          })}
        </div>
      ) : (
        /* Compact progress bar for large decks */
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 160, height: 4, background: 'var(--line-2)',
            borderRadius: 2, overflow: 'hidden', flexShrink: 0,
          }}>
            <div style={{
              width: `${((index + 1) / total) * 100}%`,
              height: '100%',
              background: 'var(--syn-amber)',
              borderRadius: 2,
              transition: 'width var(--dur-2) var(--ease-out)',
            }} />
          </div>
          {solvedSet.size > 0 && (
            <span style={{ fontSize: 11, color: 'var(--syn-green)', fontFamily: 'var(--font-mono)' }}>
              {solvedSet.size} solved
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function FrontFace({ question, index, total, solved }) {
  const diff = normalizeDifficulty(question.difficulty);
  return (
    <div className="ld-face-front">
      <div className="ld-front-top">
        <div className="ld-eyebrow">PROBLEM · #{index + 1}</div>
        {diff && (
          <span className={`ld-chip ${diffChipClass(diff)}`}>
            <span className="dot" />{diff}
          </span>
        )}
      </div>
      <div className="ld-front-title">{question.title}</div>
      {question.slug && (
        <div className="ld-front-url">leetcode.com/problems/{question.slug}</div>
      )}
      <div className="ld-front-foot">
        <span>Card {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span className="ld-reveal-hint">
          {solved && <span className="ld-solved-badge">SOLVED</span>}
          <span><KBD>space</KBD>reveal</span>
        </span>
      </div>
    </div>
  );
}

function BackFace({ question, index, total }) {
  const diff       = normalizeDifficulty(question.difficulty);
  const categories = parseCategories(question.category);
  return (
    <div className="ld-face-back">
      <div className="ld-back-head">
        <div className="ld-back-title-row">
          <h2 className="ld-back-title">{question.title}</h2>
          {diff && (
            <span className={`ld-chip ${diffChipClass(diff)}`}>
              <span className="dot" />{diff}
            </span>
          )}
        </div>
        <span className="ld-back-num">#{index + 1}</span>
      </div>

      {categories.length > 0 && (
        <div className="ld-back-section">
          <div className="ld-row-label">CATEGORY</div>
          <div className="ld-row-cats">
            {categories.map(c => (
              <span key={c} className={`ld-chip ld-chip-cat ${catClass(c)}`}>{c}</span>
            ))}
          </div>
        </div>
      )}

      <div className="ld-back-section">
        <div className="ld-row-label">SOLUTION</div>
        <CodeBlock source={question.solution || '# No solution available'} />
      </div>

      <div className="ld-back-section">
        <div className="ld-complexity-box">
          <div>
            <div className="ld-cx-label">TIME</div>
            <div className="ld-cx-val time">{question.time_complexity || '—'}</div>
          </div>
          <div>
            <div className="ld-cx-label">SPACE</div>
            <div className="ld-cx-val space">{question.space_complexity || '—'}</div>
          </div>
        </div>
      </div>

      <div className="ld-back-foot">
        <span>Card {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span><KBD>space</KBD>back to front</span>
      </div>
    </div>
  );
}

function FlashcardFace({ question, index, total, flipped, onFlip, solved }) {
  return (
    <div className="ld-card-wrap">
      <div
        className={`ld-card-face ${flipped ? 'is-back' : 'is-front'}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Click to show front' : 'Click to reveal solution'}
        onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onFlip()}
        key={flipped ? 'back' : 'front'}
      >
        {flipped
          ? <BackFace question={question} index={index} total={total} />
          : <FrontFace question={question} index={index} total={total} solved={solved} />
        }
      </div>
    </div>
  );
}

function DeckControls({ onPrev, onNext, onShuffle, onMarkSolved, atStart, atEnd, solved }) {
  return (
    <div className="ld-controls">
      <button className="ld-btn" onClick={onPrev} disabled={atStart} aria-label="Previous card">
        ← Prev
      </button>
      <div className="ld-controls-center">
        <button className="ld-btn" onClick={onShuffle} aria-label="Shuffle deck">
          Shuffle <span className="ld-kbd-hint">S</span>
        </button>
        <button
          className={`ld-btn ${solved ? '' : 'ld-btn-primary'}`}
          onClick={onMarkSolved}
          aria-label={solved ? 'Unmark solved' : 'Mark as solved'}
        >
          {solved ? 'Unmark' : 'Mark Solved'}{' '}
          <span className="ld-kbd-hint">M</span>
        </button>
      </div>
      <button className="ld-btn ld-btn-primary" onClick={onNext} disabled={atEnd} aria-label="Next card">
        Next →
      </button>
    </div>
  );
}

function KeyboardHints({ solvedCount, total }) {
  return (
    <div className="ld-kbd-strip">
      <span className="item"><KBD>←</KBD><KBD>→</KBD> navigate</span>
      <span className="item"><KBD>space</KBD> flip</span>
      <span className="item"><KBD>S</KBD> shuffle</span>
      <span className="item"><KBD>M</KBD> mark solved</span>
      <span className="item"><KBD>/</KBD> search</span>
      <span className="spacer" />
      <span className="status">
        <span className="ok">●</span> {solvedCount} / {total} solved
      </span>
    </div>
  );
}

function SearchPalette({ questions, onPick, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    const norm = q.trim().toLowerCase();
    if (!norm) return questions.slice(0, 8);
    return questions.filter(p =>
      p.title.toLowerCase().includes(norm) ||
      (p.category || '').toLowerCase().includes(norm)
    ).slice(0, 8);
  }, [q, questions]);

  useEffect(() => { setSel(0); }, [q]);

  function onKey(e) {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSel(s => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (results[sel]) onPick(results[sel]); }
    else if (e.key === 'Escape')    { e.preventDefault(); onClose(); }
  }

  const escStyle = { border: '1px solid var(--line-2)', background: 'var(--bg-inset)', padding: '1px 5px', borderRadius: 3, color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', fontSize: 11 };

  return (
    <div className="ld-search-scrim ld-fade-in" onClick={onClose}>
      <div className="ld-search-box" onClick={e => e.stopPropagation()}>
        <div className="ld-search-input-row">
          <span className="pre">&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="search by title or category…"
            autoComplete="off"
          />
          <kbd style={escStyle}>esc</kbd>
        </div>
        <div className="ld-search-results">
          {results.length === 0 ? (
            <div className="ld-search-empty">No matches.</div>
          ) : (
            results.map((r, i) => (
              <div
                key={r.slug || r.title}
                className={`ld-search-result${i === sel ? ' sel' : ''}`}
                onMouseEnter={() => setSel(i)}
                onClick={() => onPick(r)}
              >
                <div className="sr-left">
                  <span className="sr-title">{r.title}</span>
                  <span className="sr-cat">{r.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SetupScreen({ company, questions, onStart }) {
  const [num, setNum] = useState('');
  const [err, setErr] = useState('');

  function handleStart() {
    const n = parseInt(num, 10);
    if (n > 0 && n <= questions.length) {
      onStart(n);
    } else {
      setErr(`Enter a number between 1 and ${questions.length}.`);
    }
  }

  return (
    <div className="ld-setup">
      <div className="ld-setup-context">{company} · {questions.length} questions available</div>
      <div className="ld-setup-heading">How many cards?</div>
      <div className="ld-setup-row">
        <input
          className="ld-setup-input"
          type="number"
          min={1}
          max={questions.length}
          value={num}
          onChange={e => { setNum(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          placeholder={`1 – ${questions.length}`}
          autoFocus
        />
        <button className="ld-btn ld-btn-primary" onClick={handleStart} disabled={!num}>
          Start
        </button>
      </div>
      {err && <div className="ld-setup-error">{err}</div>}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const FlashCardGame = ({ company, pattern, categoryType, questions, onBack }) => {
  const isCompany = categoryType === 'company';
  const isSingle  = categoryType === 'search';

  const [difficulty, setDifficulty] = useState('all');

  // Counts per difficulty from the full questions prop
  const counts = useMemo(() => ({
    all:    questions.length,
    Easy:   questions.filter(q => normalizeDifficulty(q.difficulty) === 'Easy').length,
    Medium: questions.filter(q => normalizeDifficulty(q.difficulty) === 'Medium').length,
    Hard:   questions.filter(q => normalizeDifficulty(q.difficulty) === 'Hard').length,
  }), [questions]);

  // Filtered base pool (before shuffle / count limit)
  const filteredBase = useMemo(() =>
    difficulty === 'all'
      ? questions
      : questions.filter(q => normalizeDifficulty(q.difficulty) === difficulty),
  [questions, difficulty]);

  // chosenCount: how many cards the user asked for (company setup). Null = all.
  const [chosenCount, setChosenCount] = useState(null);
  const [setupDone, setSetupDone]     = useState(!isCompany);
  const [deck, setDeck]               = useState(() =>
    isCompany ? [] : [...filteredBase].sort(() => Math.random() - 0.5)
  );
  const [index, setIndex]         = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [solvedSet, setSolvedSet] = useState(() => new Set());
  const [searchOpen, setSearchOpen] = useState(false);

  // Rebuild deck when the difficulty filter changes (after setup completes).
  useEffect(() => {
    if (!setupDone) return;
    const pool = [...filteredBase].sort(() => Math.random() - 0.5);
    // Re-apply the user's chosen count for company mode, capped to pool size.
    setDeck(chosenCount !== null ? pool.slice(0, chosenCount) : pool);
    setIndex(0);
    setFlipped(false);
    setSolvedSet(new Set());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBase]);

  function handleSetupStart(n) {
    const pool = [...filteredBase].sort(() => Math.random() - 0.5);
    setChosenCount(n);
    setDeck(pool.slice(0, n));
    setSetupDone(true);
  }

  function next()  { if (index < deck.length - 1) { setIndex(i => i + 1); setFlipped(false); } }
  function prev()  { if (index > 0)               { setIndex(i => i - 1); setFlipped(false); } }
  function shuffle() {
    setDeck(d => [...d].sort(() => Math.random() - 0.5));
    setIndex(0); setFlipped(false);
  }
  function markSolved() {
    setSolvedSet(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }
  function jumpTo(question) {
    const i = deck.findIndex(q => (q.slug || q.title) === (question.slug || question.title));
    if (i >= 0) setIndex(i);
    setFlipped(false);
    setSearchOpen(false);
  }

  // Keyboard bindings
  useEffect(() => {
    if (!setupDone) return;
    function onKey(e) {
      if (searchOpen) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if      (e.key === 'ArrowRight')              { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft')               { e.preventDefault(); prev(); }
      else if (e.key === ' ')                       { e.preventDefault(); setFlipped(f => !f); }
      else if (e.key === 's' || e.key === 'S')      { e.preventDefault(); shuffle(); }
      else if (e.key === 'm' || e.key === 'M')      { e.preventDefault(); markSolved(); }
      else if (e.key === '/')                       { e.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // next/prev/markSolved/shuffle close over index & deck which are already deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck, searchOpen, setupDone]);

  const deckFileName = company ? `${company.toLowerCase()}.deck` : pattern ? `${pattern.toLowerCase().replace(/\s+/g, '-')}.deck` : 'search.deck';
  const current      = deck[index];

  return (
    <div className="ld-root" style={{
      position: 'fixed', inset: 0, background: 'var(--bg-0)', zIndex: 100,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      {/* Header */}
      <header className="ld-hdr">
        <button className="ld-btn ld-btn-ghost" onClick={onBack} style={{ padding: '0 10px', minWidth: 'auto' }}>
          ← back
        </button>
        <div className="ld-hdr-logo">
          <span className="prompt">&gt;</span>leetdeck
        </div>
        <div className="ld-hdr-path">
          <span className="seg">~/decks</span>
          <span className="sep">/</span>
          <span className="seg">{deckFileName}</span>
          {setupDone && (
            <>
              <span className="sep">·</span>
              <span>{String(deck.length).padStart(2, '0')} cards</span>
            </>
          )}
        </div>
        <div className="ld-hdr-spacer" />
        {setupDone && !isSingle && (
          <div className="ld-hdr-actions">
            <button className="ld-btn ld-btn-ghost" onClick={() => setSearchOpen(true)}>
              Search <span className="ld-kbd-hint">/</span>
            </button>
          </div>
        )}
      </header>

      {/* Difficulty filter bar */}
      {!isSingle && (
        <FilterBar difficulty={difficulty} setDifficulty={setDifficulty} counts={counts} />
      )}

      {/* Stage */}
      <div className="ld-stage">
        {!setupDone ? (
          <SetupScreen company={company} questions={filteredBase} onStart={handleSetupStart} />
        ) : !current ? (
          <div style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>No questions available.</div>
        ) : (
          <>
            {!isSingle && <DeckMeta index={index} total={deck.length} solvedSet={solvedSet} />}
            <FlashcardFace
              question={current}
              index={index}
              total={deck.length}
              flipped={flipped}
              onFlip={() => setFlipped(f => !f)}
              solved={solvedSet.has(index)}
            />
            {!isSingle && (
              <DeckControls
                onPrev={prev}
                onNext={next}
                onShuffle={shuffle}
                onMarkSolved={markSolved}
                atStart={index === 0}
                atEnd={index === deck.length - 1}
                solved={solvedSet.has(index)}
              />
            )}
          </>
        )}
      </div>

      {/* Fixed keyboard hints */}
      {setupDone && !isSingle && (
        <KeyboardHints solvedCount={solvedSet.size} total={deck.length} />
      )}

      {/* Search palette */}
      {searchOpen && (
        <SearchPalette
          questions={questions}
          onPick={jumpTo}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
};

export default FlashCardGame;
