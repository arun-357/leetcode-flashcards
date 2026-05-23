import styled from '@emotion/styled';
import { t } from './theme.js';

export const Header = styled.header`
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 ${t.space[6]};
  border-bottom: 1px solid ${t.colors.line1};
  background: ${t.colors.bg1};
  gap: ${t.space[6]};
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: ${t.shadow[1]};
  flex-shrink: 0;

  @media (max-width: 900px) { padding: 0 16px; gap: 16px; }
  @media (max-width: 640px) { padding: 0 14px; gap: 12px; }
`;

export const HeaderLogo = styled.div`
  font-family: ${t.fonts.mono};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: ${t.tracking.tight};
  color: ${t.colors.fg1};
  white-space: nowrap;

  & .prompt { color: ${t.colors.synGreen}; margin-right: 5px; }
`;

export const HeaderPath = styled.div`
  font-family: ${t.fonts.mono};
  font-size: 12px;
  color: ${t.colors.fg3};
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;

  & .seg { color: ${t.colors.fg2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  & .sep { color: ${t.colors.fg4}; flex-shrink: 0; }

  @media (max-width: 900px) { font-size: 11px; }
  @media (max-width: 640px) { display: none; }
`;

export const HeaderSpacer = styled.div`
  flex: 1;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${t.space[2]};
  flex-shrink: 0;
`;
