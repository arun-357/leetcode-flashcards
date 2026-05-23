import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { t } from '../styles/theme.js';

// ── Nav Shell ────────────────────────────────────────────────────────────────

export const NavShell = styled.div`
  min-height: 100vh;
  background: ${t.colors.bg0};
  display: flex;
  flex-direction: column;
`;

export const NavContent = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: ${t.space[8]} ${t.space[6]} 120px;
  display: flex;
  flex-direction: column;
  gap: ${t.space[8]};

  @media (max-width: 900px) { padding: ${t.space[6]} ${t.space[4]} 100px; }
  @media (max-width: 640px) { padding: ${t.space[5]} ${t.space[3]} 80px; gap: ${t.space[5]}; }
`;

export const LldContainer = styled.div`
  padding: ${t.space[6]} ${t.space[6]} 100px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
`;

// ── Category ─────────────────────────────────────────────────────────────────

export const CatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${t.space[4]};
`;

export const CatToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[2]};
  background: ${t.colors.bg1};
  color: ${t.colors.fg1};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${t.dur[2]} ${t.ease.out};
  width: 100%;

  &:hover { background: ${t.colors.bg2}; border-color: ${t.colors.lineFocus}; }
`;

export const ToggleChevron = styled.span`
  color: ${t.colors.fg3};
  font-size: 11px;
  transition: transform ${t.dur[2]} ${t.ease.out};
  ${({ $open }) => $open && css`transform: rotate(180deg);`}
`;

export const CatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${t.space[2]};
  padding-top: 4px;

  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 420px) { grid-template-columns: 1fr; }
`;

export const CatItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  padding: 16px 14px;
  min-height: 90px;
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[2]};
  background: ${t.colors.bg1};
  color: ${t.colors.fg1};
  cursor: pointer;
  transition: all ${t.dur[2]} ${t.ease.out};
  font-family: ${t.fonts.mono};

  &:hover { background: ${t.colors.bg2}; border-color: ${t.colors.lineFocus}; }
  &:focus-visible { outline: none; box-shadow: ${t.shadow.ring}; }

  & .cat-icon  { color: ${t.colors.synGreen}; font-size: 18px; }
  & .cat-name  { font-size: ${t.text.sm}; font-weight: 500; color: ${t.colors.fg1}; line-height: 1.3; }
  & .cat-count { font-size: ${t.text.xs}; color: ${t.colors.fg3}; }

  @media (hover: none) { &:hover { background: ${t.colors.bg1}; border-color: ${t.colors.line2}; } }
`;

// ── LLD Button ────────────────────────────────────────────────────────────────

export const LldBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[2]};
  background: ${t.colors.bg1};
  color: ${t.colors.fg1};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all ${t.dur[2]} ${t.ease.out};

  &:hover { background: ${t.colors.bg2}; border-color: ${t.colors.lineFocus}; }

  & .lld-arrow { color: ${t.colors.synGreen}; }
`;

// ── Nav Search ────────────────────────────────────────────────────────────────

export const NavSearch = styled.div`
  border: 1px solid ${t.colors.line2};
  border-radius: ${t.radius[3]};
  background: ${t.colors.bg1};
  overflow: hidden;
`;

export const NavSearchInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;

  & .pre { color: ${t.colors.synGreen}; font-family: ${t.fonts.mono}; }

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

export const NavSearchResults = styled.div`
  border-top: 1px solid ${t.colors.line1};
  padding: 5px;
`;

export const NavSearchResult = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-radius: ${t.radius[2]};
  cursor: pointer;
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
  transition: background ${t.dur[1]} ${t.ease.out};

  &:hover { background: ${t.colors.bg3}; }

  & .nsr-title { color: ${t.colors.fg1}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

export const NavSearchResultMeta = styled.span`
  font-size: 11px;
  white-space: nowrap;
  color: ${({ $dim }) => $dim ? t.colors.fg4 : t.colors.fg3};
`;

export const NoResults = styled.div`
  padding: 14px;
  color: ${t.colors.fg3};
  font-family: ${t.fonts.mono};
  font-size: ${t.text.sm};
`;
