import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { t } from '../../styles/theme.js';

// ── Keyframes ─────────────────────────────────────────────────────────────────

const faceFade = keyframes`
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Root ──────────────────────────────────────────────────────────────────────

export const Root = styled.div`
  position: fixed;
  inset: 0;
  background: ${t.colors.bg0};
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  & * { scrollbar-width: thin; scrollbar-color: ${t.colors.line2} transparent; }
  & *::-webkit-scrollbar { width: 6px; height: 6px; }
  & *::-webkit-scrollbar-thumb { background: ${t.colors.line2}; border-radius: ${t.radius.pill}; }
  & *::-webkit-scrollbar-thumb:hover { background: ${t.colors.lineFocus}; }
`;

// ── Filter Bar ────────────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px ${t.space[6]};
  border-bottom: 1px solid ${t.colors.line1};
  background: ${t.colors.bg0};
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (max-width: 900px) { padding: 12px 16px; gap: 10px; }
  @media (max-width: 640px) { padding: 10px 14px; gap: 8px; }
`;

export const FilterLabel = styled.span`
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;
  color: ${t.colors.fg3};
  white-space: nowrap;

  @media (max-width: 640px) { font-size: 10px; }
`;

export const FilterChipsRow = styled.div`
  display: flex;
  gap: 6px;
`;

export const FilterDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${t.radius.pill};
  background: currentColor;
  flex-shrink: 0;
`;

const fchipActive = {
  all:    css`background: ${t.colors.bg3}; border-color: ${t.colors.lineFocus}; color: ${t.colors.fg1};`,
  easy:   css`background: ${t.colors.diffEasyBg}; border-color: ${t.colors.diffEasyLine}; color: ${t.colors.diffEasy};`,
  medium: css`background: ${t.colors.diffMediumBg}; border-color: ${t.colors.diffMediumLine}; color: ${t.colors.diffMedium};`,
  hard:   css`background: ${t.colors.diffHardBg}; border-color: ${t.colors.diffHardLine}; color: ${t.colors.diffHard};`,
};

export const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: ${t.radius.pill};
  font-family: ${t.fonts.mono};
  font-size: 12px;
  border: 1px solid ${t.colors.line2};
  background: ${t.colors.bg1};
  color: ${t.colors.fg2};
  cursor: pointer;
  transition: all ${t.dur[2]} ${t.ease.out};
  user-select: none;

  &:hover { border-color: ${t.colors.lineFocus}; color: ${t.colors.fg1}; }
  ${({ $active, $variant }) => $active && fchipActive[$variant]}

  @media (max-width: 640px) { font-size: 11px; height: 24px; padding: 0 8px; }
  @media (hover: none) { &:hover { border-color: ${t.colors.line2}; color: ${t.colors.fg2}; } }
`;

// ── Stage ─────────────────────────────────────────────────────────────────────

export const Stage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${t.space[10]} ${t.space[6]} 100px;
  gap: ${t.space[6]};
  width: 100%;

  @media (max-width: 900px) { padding: 32px 16px 110px; }
  @media (max-width: 640px) { padding: 24px 12px 32px; gap: 18px; }
  @media (max-width: 420px) { padding: 18px 10px 80px; }
`;

// ── Deck Meta ─────────────────────────────────────────────────────────────────

export const DeckMeta = styled.div`
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  color: ${t.colors.fg2};
  white-space: nowrap;

  & .n { color: ${t.colors.fg1}; }

  @media (max-width: 640px) { font-size: 12px; }
`;

export const Dots = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow: hidden;

  @media (max-width: 640px) { display: none; }
`;

export const Dot = styled.span`
  width: 18px;
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
  background: ${({ $state }) =>
    $state === 'done'    ? t.colors.synGreen :
    $state === 'current' ? t.colors.synAmber : t.colors.line2};
  transition: background ${t.dur[2]} ${t.ease.out};
`;

export const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ $showDots }) => $showDots && css`display: none;`}

  @media (max-width: 640px) { display: flex !important; }
`;

export const ProgressTrack = styled.div`
  width: 160px;
  height: 4px;
  background: ${t.colors.line2};
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${t.colors.synAmber};
  border-radius: 2px;
  transition: width ${t.dur[2]} ${t.ease.out};
  width: ${({ $width }) => $width};
`;

export const ProgressSolved = styled.span`
  font-size: 11px;
  color: ${t.colors.synGreen};
  font-family: ${t.fonts.mono};
`;

// ── Card ──────────────────────────────────────────────────────────────────────

export const CardWrap = styled.div`
  width: 100%;
  max-width: 760px;
`;

export const CardFace = styled.div`
  background: ${t.colors.bg1};
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[4]};
  padding: 32px 32px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: border-color ${t.dur[2]} ${t.ease.out};
  animation: ${faceFade} ${t.dur[3]} ${t.ease.out};

  &:hover { border-color: ${t.colors.lineFocus}; }
  ${({ $flipped }) => !$flipped && css`min-height: 340px;`}
  ${({ $flipped }) =>  $flipped && css`padding: 26px 28px 22px; gap: 18px;`}

  @media (max-width: 900px) {
    padding: 26px 24px 20px;
    border-radius: 12px;
    ${({ $flipped }) => $flipped && css`padding: 22px 22px 18px;`}
  }
  @media (max-width: 640px) {
    padding: 22px 18px 18px;
    border-radius: 10px;
    ${({ $flipped }) => $flipped && css`padding: 18px 16px 16px; gap: 14px;`}
  }
  @media (max-width: 420px) {
    padding: 18px 14px 14px;
    ${({ $flipped }) => $flipped && css`padding: 16px 12px 14px;`}
  }
  @media (hover: none) { &:hover { border-color: ${t.colors.line2}; } }
`;

// ── Front Face ────────────────────────────────────────────────────────────────

export const FaceFront = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;

  @media (max-width: 640px) { min-height: 220px; }
`;

export const FrontTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Eyebrow = styled.div`
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;
  color: ${t.colors.fg3};
`;

export const FrontTitle = styled.div`
  font-family: ${t.fonts.mono};
  font-size: clamp(28px, 7vw, 48px);
  font-weight: 600;
  letter-spacing: ${t.tracking.tight};
  line-height: ${t.leading.tight};
  color: ${t.colors.fg1};
  margin-top: auto;
  margin-bottom: 12px;
`;

export const FrontUrl = styled.div`
  font-family: ${t.fonts.mono};
  font-size: 12px;
  color: ${t.colors.fg3};

  @media (max-width: 420px) { font-size: 11px; }
`;

export const FrontFoot = styled.div`
  margin-top: ${t.space[8]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${t.fonts.mono};
  font-size: 12px;
  color: ${t.colors.fg3};

  @media (max-width: 640px) { font-size: 11px; }
`;

export const RevealHint = styled.span`
  display: flex;
  align-items: center;
  gap: ${t.space[2]};
`;

export const DescriptionText = styled.div`
  font-size: 0.83rem;
  line-height: 1.65;
  color: ${t.colors.fg2};
  text-align: left;
  overflow-y: auto;
  max-height: 240px;
  padding: 12px 14px;
  background: ${t.colors.bg2};
  border-radius: 8px;
  border: 1px solid ${t.colors.line2};
  white-space: pre-line;
  word-break: break-word;
  margin-top: 14px;

  @media (max-width: 640px) {
    max-height: 180px;
    font-size: 0.78rem;
  }
`;

// ── Back Face ─────────────────────────────────────────────────────────────────

export const FaceBack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BackHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BackTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${t.space[3]};
  flex-wrap: wrap;
`;

export const BackTitle = styled.h2`
  margin: 0;
  font-family: ${t.fonts.mono};
  font-size: clamp(20px, 4.5vw, 28px);
  font-weight: 600;
  letter-spacing: ${t.tracking.tight};
  color: ${t.colors.fg1};

  @media (max-width: 640px) { line-height: 1.15; }
`;

export const BackNum = styled.span`
  font-family: ${t.fonts.mono};
  color: ${t.colors.fg4};
  font-size: ${t.text.sm};

  @media (max-width: 640px) { display: none; }
`;

export const BackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RowLabel = styled.div`
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;
  color: ${t.colors.fg3};
`;

export const RowCats = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const ComplexityBox = styled.div`
  background: ${t.colors.bgInset};
  border: 1px solid ${t.colors.line1};
  border-radius: ${t.radius[2]};
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 640px) { padding: 12px 14px; gap: 12px; }
`;

export const CxLabel = styled.div`
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;
  color: ${t.colors.fg3};
  margin-bottom: 4px;
`;

export const CxVal = styled.div`
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xl};
  font-weight: 500;
  line-height: 1.1;
  color: ${({ $kind }) =>
    $kind === 'time'  ? t.colors.synGreen :
    $kind === 'space' ? t.colors.synAmber : t.colors.fg1};
`;

export const BackFoot = styled.div`
  margin-top: ${t.space[2]};
  padding-top: 14px;
  border-top: 1px solid ${t.colors.line1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${t.fonts.mono};
  font-size: 12px;
  color: ${t.colors.fg3};

  @media (max-width: 640px) { font-size: 11px; }
`;

// ── Code Block ────────────────────────────────────────────────────────────────
// NOTE: className="ld-codeblock" MUST remain on CodeBlockContainer in JSX.
// GlobalStyles scopes .tk-* syntax token rules under .ld-codeblock, and those
// spans are injected via dangerouslySetInnerHTML — Emotion cannot scope them.

export const CodeBlockContainer = styled.div`
  position: relative;
  background: ${t.colors.bgInset};
  border: 1px solid ${t.colors.line1};
  border-radius: ${t.radius[2]};
  font-family: ${t.fonts.mono};
  font-size: 13px;
  line-height: 1.55;
  cursor: text;

  @media (max-width: 640px) { font-size: 12px; }
`;

export const CodeBlockCopyBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${t.colors.bg1};
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[1]};
  color: ${t.colors.fg3};
  cursor: pointer;
  transition: all ${t.dur[2]} ${t.ease.out};
  z-index: 2;

  &:hover { color: ${t.colors.fg1}; border-color: ${t.colors.lineFocus}; }
  &:focus-visible { outline: none; box-shadow: ${t.shadow.ring}; }

  @media (max-width: 640px) { top: 7px; right: 7px; width: 24px; height: 24px; }
`;

export const CodeBlockScroll = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 14px 0;

  @media (max-width: 640px) { padding: 10px 0; }
`;

export const CodeBlockGutter = styled.div`
  flex-shrink: 0;
  padding: 0 14px 0 16px;
  text-align: right;
  color: ${t.colors.fg4};
  user-select: none;
  border-right: 1px solid ${t.colors.line1};

  @media (max-width: 640px) { padding: 0 10px 0 12px; }
`;

export const CodeBlockLn = styled.div`
  white-space: pre;
`;

export const CodeBlockPre = styled.pre`
  margin: 0;
  padding: 0 18px 0 14px;
  flex: 1;
  min-width: 0;
  white-space: pre;
  color: ${t.colors.fg1};

  & code { font-family: inherit; }

  @media (max-width: 640px) { padding: 0 14px 0 10px; }
`;

// ── Chips ─────────────────────────────────────────────────────────────────────

const chipVariant = {
  easy:   css`color: ${t.colors.diffEasy};   background: ${t.colors.diffEasyBg};   border-color: ${t.colors.diffEasyLine};`,
  medium: css`color: ${t.colors.diffMedium}; background: ${t.colors.diffMediumBg}; border-color: ${t.colors.diffMediumLine};`,
  hard:   css`color: ${t.colors.diffHard};   background: ${t.colors.diffHardBg};   border-color: ${t.colors.diffHardLine};`,
  cat:    css`color: ${t.colors.fg2};        background: ${t.colors.bg2};          border-color: ${t.colors.line2};`,
};

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 9px;
  border-radius: ${t.radius.pill};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  font-weight: 500;
  letter-spacing: ${t.tracking.mono};
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;

  & .dot { width: 6px; height: 6px; border-radius: ${t.radius.pill}; background: currentColor; flex-shrink: 0; }

  ${({ $variant }) => chipVariant[$variant] ?? ''}
`;

// ── Button ────────────────────────────────────────────────────────────────────

export const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 34px;
  padding: 0 14px;
  border-radius: ${t.radius[2]};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  font-weight: 500;
  letter-spacing: ${t.tracking.mono};
  border: 1px solid ${t.colors.line2};
  background: ${t.colors.bg2};
  color: ${t.colors.fg1};
  cursor: pointer;
  transition: all ${t.dur[2]} ${t.ease.out};
  white-space: nowrap;
  text-decoration: none;

  &:hover { background: ${t.colors.bg3}; border-color: ${t.colors.lineFocus}; }
  &:active { transform: scale(0.97); }
  &:focus-visible { outline: none; box-shadow: ${t.shadow.ring}; }
  &:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }

  ${({ $primary }) => $primary && css`
    background: ${t.colors.synGreen};
    border-color: ${t.colors.synGreen};
    color: ${t.colors.brandInk};
    &:hover { background: #6bd474; border-color: #6bd474; }

    & .ld-kbd-hint {
      color: rgba(10,13,18,0.55);
      border-color: rgba(10,13,18,0.2);
      background: rgba(10,13,18,0.08);
    }
  `}

  ${({ $ghost }) => $ghost && css`
    background: transparent;
    border-color: transparent;
    color: ${t.colors.fg2};
    &:hover { background: ${t.colors.bg2}; color: ${t.colors.fg1}; border-color: ${t.colors.line2}; }
  `}

  ${({ $compact }) => $compact && css`padding: 0 10px; min-width: auto;`}

  & .ld-kbd-hint {
    font-size: 10px;
    color: ${t.colors.fg3};
    border: 1px solid ${t.colors.line2};
    border-radius: 3px;
    padding: 1px 5px;
    background: ${t.colors.bgInset};
    font-family: ${t.fonts.mono};
  }

  @media (max-width: 640px) {
    height: 32px;
    font-size: 12px;
    padding: 0 12px;
    ${({ $compact }) => $compact && css`padding: 0 10px;`}
    & .ld-kbd-hint { display: none; }
  }
  @media (max-width: 420px) {
    ${({ $compact }) => $compact && css`padding: 0 8px;`}
  }
  @media (hover: none) { &:hover { background: ${t.colors.bg2}; border-color: ${t.colors.line2}; } }
`;

// ── Controls ──────────────────────────────────────────────────────────────────

export const Controls = styled.div`
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 640px) { flex-wrap: wrap; row-gap: 10px; }
`;

export const ControlsCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 640px) { order: 3; width: 100%; justify-content: center; }
`;

// ── Solved Badge ──────────────────────────────────────────────────────────────

export const SolvedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${t.colors.synGreen};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${t.colors.synGreen};
    border-radius: ${t.radius.pill};
    flex-shrink: 0;
  }
`;

// ── Keyboard Hints Strip ──────────────────────────────────────────────────────

export const KbdStrip = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px ${t.space[6]};
  background: ${t.colors.bg1};
  border-top: 1px solid ${t.colors.line1};
  font-family: ${t.fonts.mono};
  font-size: 12px;
  color: ${t.colors.fg3};
  z-index: 15;
  flex-wrap: wrap;

  & .item   { display: inline-flex; align-items: center; gap: 5px; }
  & .spacer { flex: 1; }
  & .status .ok { color: ${t.colors.synGreen}; }

  @media (max-width: 600px) { gap: 10px; font-size: 11px; }
  @media (max-width: 640px) { display: none; }
`;

export const KbdKey = styled.kbd`
  border: 1px solid ${t.colors.line2};
  background: ${t.colors.bgInset};
  padding: 1px 5px;
  border-radius: 3px;
  color: ${t.colors.fg1};
  font-family: ${t.fonts.mono};
  font-size: 11px;
  margin-right: 5px;
`;

// ── Search Palette ────────────────────────────────────────────────────────────

export const SearchScrim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 13, 18, 0.72);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 30;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 16vh;
  animation: ${fadeIn} ${t.dur[2]} ${t.ease.out};

  @media (max-width: 640px) { padding-top: 8vh; }
`;

export const SearchBox = styled.div`
  width: min(560px, 92vw);
  background: ${t.colors.bg2};
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[3]};
  box-shadow: ${t.shadow[3]};
  overflow: hidden;

  @media (max-width: 640px) { width: min(560px, calc(100vw - 24px)); }
`;

export const SearchInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 15px;
  border-bottom: 1px solid ${t.colors.line1};

  & .pre { color: ${t.colors.synGreen}; font-family: ${t.fonts.mono}; font-size: 14px; }

  & input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: ${t.colors.fg1};
    font-family: ${t.fonts.mono};
    font-size: 14px;
    letter-spacing: ${t.tracking.mono};
  }
  & input::placeholder { color: ${t.colors.fg4}; }
`;

export const SearchResultsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 5px;
`;

export const SearchResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 11px;
  border-radius: ${t.radius[2]};
  cursor: pointer;
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  transition: background ${t.dur[1]} ${t.ease.out};

  &:hover { background: ${t.colors.bg3}; }
  ${({ $sel }) => $sel && css`background: ${t.colors.bg3};`}

  & .sr-left  { display: flex; align-items: center; gap: 9px; min-width: 0; }
  & .sr-title { color: ${t.colors.fg1}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  & .sr-cat   { color: ${t.colors.fg3}; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

export const SearchEmpty = styled.div`
  padding: 18px;
  color: ${t.colors.fg3};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  text-align: center;
`;

// ── Setup Screen ──────────────────────────────────────────────────────────────

export const Setup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: ${t.space[6]};
  font-family: ${t.fonts.mono};
  color: ${t.colors.fg1};
  padding: ${t.space[8]};
  text-align: center;
`;

export const SetupContext = styled.div`
  font-size: ${t.text.xs};
  letter-spacing: ${t.tracking.caps};
  text-transform: uppercase;
  color: ${t.colors.fg3};
`;

export const SetupHeading = styled.div`
  font-size: ${t.text.xl};
  font-weight: 600;
  color: ${t.colors.fg1};
`;

export const SetupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SetupInput = styled.input`
  background: ${t.colors.bgInset};
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[2]};
  color: ${t.colors.fg1};
  font-family: ${t.fonts.mono};
  font-size: 14px;
  padding: 8px 12px;
  width: 120px;
  outline: none;
  transition: border-color ${t.dur[2]} ${t.ease.out};

  &:focus { border-color: ${t.colors.lineFocus}; box-shadow: ${t.shadow.ring}; }
`;

export const SetupError = styled.div`
  color: ${t.colors.synRed};
  font-size: ${t.text.sm};
`;

export const NoQuestionsText = styled.div`
  color: ${t.colors.fg3};
  font-family: ${t.fonts.mono};
`;
