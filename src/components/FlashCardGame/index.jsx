import { useState, useMemo, useEffect, useRef } from 'react';
import { t } from '../../styles/theme.js';
import {
  Root, FilterBar, FilterLabel, FilterChipsRow, FilterDot, FilterChip,
  Stage, DeckMeta, Dots, Dot, ProgressBar, ProgressTrack, ProgressFill, ProgressSolved,
  CardWrap, CardFace,
  FaceFront, FrontTop, Eyebrow, FrontTitle, FrontUrl, FrontFoot, RevealHint,
  FaceBack, BackHead, BackTitleRow, BackTitle, BackNum,
  BackSection, RowLabel, RowCats,
  ComplexityBox, CxLabel, CxVal,
  BackFoot,
  CodeBlockContainer, CodeBlockCopyBtn, CodeBlockScroll, CodeBlockGutter, CodeBlockLn, CodeBlockPre,
  Chip,
  Btn,
  Controls, ControlsCenter,
  SolvedBadge,
  KbdStrip, KbdKey,
  SearchScrim, SearchBox, SearchInputRow, SearchResultsList, SearchResult, SearchEmpty,
  Setup, SetupContext, SetupHeading, SetupRow, SetupInput, SetupError,
  NoQuestionsText,
} from './styles.js';
import { Header, HeaderLogo, HeaderPath, HeaderSpacer, HeaderActions } from '../../styles/shared.styles.js';

// ── helpers ──────────────────────────────────────────────────────────────────

function catColor(name) {
  const k = name.toLowerCase();
  if (k.includes('array') || k.includes('two pointer') || k.includes('sliding'))  return t.colors.synCyan;
  if (k.includes('hash') || k.includes('map'))    return t.colors.synPurple;
  if (k.includes('stack'))                         return t.colors.synAmber;
  if (k.includes('string'))                        return t.colors.synPink;
  if (k.includes('linked'))                        return t.colors.synCyan;
  if (k.includes('recursion'))                     return t.colors.synPurple;
  if (k.includes('dynamic') || k === 'dp' || k.includes(' dp')) return t.colors.synGreen;
  if (k.includes('sort') || k.includes('interval'))  return t.colors.synYellow;
  if (k.includes('graph') || k.includes('network'))  return t.colors.synPink;
  if (k.includes('dfs') || k.includes('bfs') || k.includes('tree') || k.includes('binary search')) return t.colors.synCyan;
  if (k.includes('topo'))   return t.colors.synAmber;
  if (k.includes('heap') || k.includes('priority')) return t.colors.synGreen;
  if (k.includes('design')) return t.colors.synPurple;
  return null;
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

function diffChipVariant(normalised) {
  if (normalised === 'Easy')   return 'easy';
  if (normalised === 'Medium') return 'medium';
  if (normalised === 'Hard')   return 'hard';
  return 'cat';
}

function FilterBarComponent({ difficulty, setDifficulty, counts }) {
  const items = [
    { key: 'all',    label: `All (${counts.all})`,       cls: 'all'    },
    { key: 'Easy',   label: `Easy (${counts.Easy})`,     cls: 'easy'   },
    { key: 'Medium', label: `Medium (${counts.Medium})`, cls: 'medium' },
    { key: 'Hard',   label: `Hard (${counts.Hard})`,     cls: 'hard'   },
  ];
  return (
    <FilterBar>
      <FilterLabel>DIFFICULTY</FilterLabel>
      <FilterChipsRow>
        {items.map(it => (
          <FilterChip
            key={it.key}
            $active={difficulty === it.key}
            $variant={it.cls}
            onClick={() => setDifficulty(it.key)}
          >
            {it.key !== 'all' && <FilterDot />}
            {it.label}
          </FilterChip>
        ))}
      </FilterChipsRow>
    </FilterBar>
  );
}

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
    const tok = m[0];
    let cls = '';
    if (tok.startsWith('#'))              cls = 'tk-comment';
    else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'tk-string';
    else if (/^\d/.test(tok))            cls = 'tk-number';
    else if (tok === '->')               cls = 'tk-arrow';
    else if (PY_KEYWORDS.has(tok))       cls = 'tk-keyword';
    else if (PY_BUILTINS.has(tok))       cls = 'tk-builtin';
    else if (/^[A-Za-z_]/.test(tok) && prev === 'def')   cls = 'tk-funcname';
    else if (/^[A-Za-z_]/.test(tok) && prev === 'class') cls = 'tk-classname';
    if (cls) out += `<span class="${cls}">${escapeHTML(tok === '->' ? '→' : tok)}</span>`;
    else out += escapeHTML(tok);
    if (/^[A-Za-z_]/.test(tok) || tok === 'def' || tok === 'class') prev = tok;
    last = m.index + tok.length;
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
    // className="ld-codeblock" scopes .tk-* rules from GlobalStyles (dangerouslySetInnerHTML spans)
    <CodeBlockContainer className="ld-codeblock" onClick={e => e.stopPropagation()}>
      <CodeBlockCopyBtn onClick={copy} aria-label="Copy code" title={copied ? 'Copied' : 'Copy'}>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        )}
      </CodeBlockCopyBtn>
      <CodeBlockScroll>
        <CodeBlockGutter aria-hidden="true">
          {lines.map((_, i) => <CodeBlockLn key={i}>{i + 1}</CodeBlockLn>)}
        </CodeBlockGutter>
        <CodeBlockPre>
          <code dangerouslySetInnerHTML={{ __html: highlightPython(lines.join('\n')) }} />
        </CodeBlockPre>
      </CodeBlockScroll>
    </CodeBlockContainer>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

const DOT_LIMIT = 20;

function DeckMetaComponent({ index, total, solvedSet }) {
  const showDots = total <= DOT_LIMIT;

  return (
    <DeckMeta>
      <div>
        Card{' '}
        <span className="n">{String(index + 1).padStart(2, '0')}</span>
        {' '}/ {String(total).padStart(2, '0')}
      </div>

      {showDots && (
        <Dots>
          {Array.from({ length: total }).map((_, i) => (
            <Dot
              key={i}
              $state={i === index ? 'current' : solvedSet.has(i) ? 'done' : 'default'}
            />
          ))}
        </Dots>
      )}

      <ProgressBar $showDots={showDots}>
        <ProgressTrack>
          <ProgressFill $width={`${((index + 1) / total) * 100}%`} />
        </ProgressTrack>
        {solvedSet.size > 0 && (
          <ProgressSolved>{solvedSet.size} solved</ProgressSolved>
        )}
      </ProgressBar>
    </DeckMeta>
  );
}

function FrontFace({ question, index, total, solved }) {
  const diff = normalizeDifficulty(question.difficulty);
  return (
    <FaceFront>
      <FrontTop>
        <Eyebrow>PROBLEM · #{index + 1}</Eyebrow>
        {diff && (
          <Chip $variant={diffChipVariant(diff)}>
            <span className="dot" />{diff}
          </Chip>
        )}
      </FrontTop>
      <FrontTitle>{question.title}</FrontTitle>
      {question.slug && (
        <FrontUrl>leetcode.com/problems/{question.slug}</FrontUrl>
      )}
      <FrontFoot>
        <span>Card {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <RevealHint>
          {solved && <SolvedBadge>SOLVED</SolvedBadge>}
          <span><KbdKey>space</KbdKey>reveal</span>
        </RevealHint>
      </FrontFoot>
    </FaceFront>
  );
}

function BackFace({ question, index, total }) {
  const diff       = normalizeDifficulty(question.difficulty);
  const categories = parseCategories(question.category);
  return (
    <FaceBack>
      <BackHead>
        <BackTitleRow>
          <BackTitle>{question.title}</BackTitle>
          {diff && (
            <Chip $variant={diffChipVariant(diff)}>
              <span className="dot" />{diff}
            </Chip>
          )}
        </BackTitleRow>
        <BackNum>#{index + 1}</BackNum>
      </BackHead>

      {categories.length > 0 && (
        <BackSection>
          <RowLabel>CATEGORY</RowLabel>
          <RowCats>
            {categories.map(c => {
              const color = catColor(c);
              return (
                <Chip
                  key={c}
                  $variant="cat"
                  style={color ? { color } : undefined}
                >
                  {c}
                </Chip>
              );
            })}
          </RowCats>
        </BackSection>
      )}

      <BackSection>
        <RowLabel>SOLUTION</RowLabel>
        <CodeBlock source={question.solution || '# No solution available'} />
      </BackSection>

      <BackSection>
        <ComplexityBox>
          <div>
            <CxLabel>TIME</CxLabel>
            <CxVal $kind="time">{question.time_complexity || '—'}</CxVal>
          </div>
          <div>
            <CxLabel>SPACE</CxLabel>
            <CxVal $kind="space">{question.space_complexity || '—'}</CxVal>
          </div>
        </ComplexityBox>
      </BackSection>

      <BackFoot>
        <span>Card {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <span><KbdKey>space</KbdKey>back to front</span>
      </BackFoot>
    </FaceBack>
  );
}

function FlashcardFace({ question, index, total, flipped, onFlip, solved }) {
  return (
    <CardWrap>
      <CardFace
        $flipped={flipped}
        key={flipped ? 'back' : 'front'}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Click to show front' : 'Click to reveal solution'}
        onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onFlip()}
      >
        {flipped
          ? <BackFace question={question} index={index} total={total} />
          : <FrontFace question={question} index={index} total={total} solved={solved} />
        }
      </CardFace>
    </CardWrap>
  );
}

function DeckControls({ onPrev, onNext, onShuffle, onMarkSolved, atStart, atEnd, solved }) {
  return (
    <Controls>
      <Btn onClick={onPrev} disabled={atStart} aria-label="Previous card">
        ← Prev
      </Btn>
      <ControlsCenter>
        <Btn onClick={onShuffle} aria-label="Shuffle deck">
          Shuffle <span className="ld-kbd-hint">S</span>
        </Btn>
        <Btn
          $primary={!solved}
          onClick={onMarkSolved}
          aria-label={solved ? 'Unmark solved' : 'Mark as solved'}
        >
          {solved ? 'Unmark' : 'Mark Solved'}{' '}
          <span className="ld-kbd-hint">M</span>
        </Btn>
      </ControlsCenter>
      <Btn $primary onClick={onNext} disabled={atEnd} aria-label="Next card">
        Next →
      </Btn>
    </Controls>
  );
}

function KeyboardHints({ solvedCount, total }) {
  return (
    <KbdStrip>
      <span className="item"><KbdKey>←</KbdKey><KbdKey>→</KbdKey> navigate</span>
      <span className="item"><KbdKey>space</KbdKey> flip</span>
      <span className="item"><KbdKey>S</KbdKey> shuffle</span>
      <span className="item"><KbdKey>M</KbdKey> mark solved</span>
      <span className="item"><KbdKey>/</KbdKey> search</span>
      <span className="spacer" />
      <span className="status">
        <span className="ok">●</span> {solvedCount} / {total} solved
      </span>
    </KbdStrip>
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

  return (
    <SearchScrim onClick={onClose}>
      <SearchBox onClick={e => e.stopPropagation()}>
        <SearchInputRow>
          <span className="pre">&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="search by title or category…"
            autoComplete="off"
          />
          <KbdKey>esc</KbdKey>
        </SearchInputRow>
        <SearchResultsList>
          {results.length === 0 ? (
            <SearchEmpty>No matches.</SearchEmpty>
          ) : (
            results.map((r, i) => (
              <SearchResult
                key={r.slug || r.title}
                $sel={i === sel}
                onMouseEnter={() => setSel(i)}
                onClick={() => onPick(r)}
              >
                <div className="sr-left">
                  <span className="sr-title">{r.title}</span>
                  <span className="sr-cat">{r.category}</span>
                </div>
              </SearchResult>
            ))
          )}
        </SearchResultsList>
      </SearchBox>
    </SearchScrim>
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
    <Setup>
      <SetupContext>{company} · {questions.length} questions available</SetupContext>
      <SetupHeading>How many cards?</SetupHeading>
      <SetupRow>
        <SetupInput
          type="number"
          min={1}
          max={questions.length}
          value={num}
          onChange={e => { setNum(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          placeholder={`1 – ${questions.length}`}
          autoFocus
        />
        <Btn $primary onClick={handleStart} disabled={!num}>
          Start
        </Btn>
      </SetupRow>
      {err && <SetupError>{err}</SetupError>}
    </Setup>
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
    <Root>
      {/* Header */}
      <Header>
        <Btn $ghost $compact onClick={onBack}>
          ← back
        </Btn>
        <HeaderLogo>
          <span className="prompt">&gt;</span>leetdeck
        </HeaderLogo>
        <HeaderPath>
          <span className="seg">~/decks</span>
          <span className="sep">/</span>
          <span className="seg">{deckFileName}</span>
          {setupDone && (
            <>
              <span className="sep">·</span>
              <span>{String(deck.length).padStart(2, '0')} cards</span>
            </>
          )}
        </HeaderPath>
        <HeaderSpacer />
        {setupDone && !isSingle && (
          <HeaderActions>
            <Btn $ghost onClick={() => setSearchOpen(true)}>
              Search <span className="ld-kbd-hint">/</span>
            </Btn>
          </HeaderActions>
        )}
      </Header>

      {/* Difficulty filter bar */}
      {!isSingle && (
        <FilterBarComponent difficulty={difficulty} setDifficulty={setDifficulty} counts={counts} />
      )}

      {/* Stage */}
      <Stage>
        {!setupDone ? (
          <SetupScreen company={company} questions={filteredBase} onStart={handleSetupStart} />
        ) : !current ? (
          <NoQuestionsText>No questions available.</NoQuestionsText>
        ) : (
          <>
            {!isSingle && <DeckMetaComponent index={index} total={deck.length} solvedSet={solvedSet} />}
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
      </Stage>

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
    </Root>
  );
};

export default FlashCardGame;
