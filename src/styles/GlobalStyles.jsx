import { Global, css } from '@emotion/react';
import { t } from './theme.js';

const styles = css`
  :root {
    --bg-0: ${t.colors.bg0};
    --bg-1: ${t.colors.bg1};
    --bg-2: ${t.colors.bg2};
    --bg-3: ${t.colors.bg3};
    --bg-inset: ${t.colors.bgInset};

    --line-1: ${t.colors.line1};
    --line-2: ${t.colors.line2};
    --line-focus: ${t.colors.lineFocus};

    --fg-1: ${t.colors.fg1};
    --fg-2: ${t.colors.fg2};
    --fg-3: ${t.colors.fg3};
    --fg-4: ${t.colors.fg4};
    --fg-on-accent: ${t.colors.fgOnAccent};

    --syn-green: ${t.colors.synGreen};
    --syn-green-dim: ${t.colors.synGreenDim};
    --syn-green-soft: ${t.colors.synGreenSoft};
    --syn-amber: ${t.colors.synAmber};
    --syn-amber-dim: ${t.colors.synAmberDim};
    --syn-amber-soft: ${t.colors.synAmberSoft};
    --syn-red: ${t.colors.synRed};
    --syn-red-dim: ${t.colors.synRedDim};
    --syn-red-soft: ${t.colors.synRedSoft};
    --syn-cyan: ${t.colors.synCyan};
    --syn-cyan-dim: ${t.colors.synCyanDim};
    --syn-cyan-soft: ${t.colors.synCyanSoft};
    --syn-purple: ${t.colors.synPurple};
    --syn-purple-soft: ${t.colors.synPurpleSoft};
    --syn-pink: ${t.colors.synPink};
    --syn-yellow: ${t.colors.synYellow};

    --diff-easy: ${t.colors.diffEasy};
    --diff-easy-bg: ${t.colors.diffEasyBg};
    --diff-easy-line: ${t.colors.diffEasyLine};
    --diff-medium: ${t.colors.diffMedium};
    --diff-medium-bg: ${t.colors.diffMediumBg};
    --diff-medium-line: ${t.colors.diffMediumLine};
    --diff-hard: ${t.colors.diffHard};
    --diff-hard-bg: ${t.colors.diffHardBg};
    --diff-hard-line: ${t.colors.diffHardLine};

    --brand: ${t.colors.brand};
    --brand-ink: ${t.colors.brandInk};

    --font-mono: ${t.fonts.mono};
    --font-sans: ${t.fonts.sans};

    --text-xs:   ${t.text.xs};
    --text-sm:   ${t.text.sm};
    --text-base: ${t.text.base};
    --text-md:   ${t.text.md};
    --text-lg:   ${t.text.lg};
    --text-xl:   ${t.text.xl};
    --text-2xl:  ${t.text['2xl']};
    --text-3xl:  ${t.text['3xl']};
    --text-4xl:  ${t.text['4xl']};

    --leading-tight: ${t.leading.tight};
    --leading-snug:  ${t.leading.snug};
    --leading-body:  ${t.leading.body};
    --tracking-tight: ${t.tracking.tight};
    --tracking-mono:  ${t.tracking.mono};
    --tracking-caps:  ${t.tracking.caps};

    --space-1:  ${t.space[1]};
    --space-2:  ${t.space[2]};
    --space-3:  ${t.space[3]};
    --space-4:  ${t.space[4]};
    --space-5:  ${t.space[5]};
    --space-6:  ${t.space[6]};
    --space-8:  ${t.space[8]};
    --space-10: ${t.space[10]};
    --space-12: ${t.space[12]};
    --space-16: ${t.space[16]};

    --radius-1:    ${t.radius[1]};
    --radius-2:    ${t.radius[2]};
    --radius-3:    ${t.radius[3]};
    --radius-4:    ${t.radius[4]};
    --radius-pill: ${t.radius.pill};

    --shadow-1:   ${t.shadow[1]};
    --shadow-2:   ${t.shadow[2]};
    --shadow-3:   ${t.shadow[3]};
    --ring-focus: ${t.shadow.ring};

    --ease-out:    ${t.ease.out};
    --ease-in-out: ${t.ease.inOut};
    --dur-1: ${t.dur[1]};
    --dur-2: ${t.dur[2]};
    --dur-3: ${t.dur[3]};
    --dur-4: ${t.dur[4]};
  }

  @keyframes ld-face-fade {
    from { opacity: 0; transform: translateY(2px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ld-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ld-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

  .ld-caret::after {
    content: "▌";
    display: inline-block;
    color: ${t.colors.synGreen};
    margin-left: 2px;
    animation: ld-caret 1.1s steps(1, end) infinite;
  }

  /* scoped via .ld-codeblock className preserved on CodeBlockContainer */
  .ld-codeblock .tk-keyword   { color: ${t.colors.synPink}; }
  .ld-codeblock .tk-funcname  { color: ${t.colors.synGreen}; }
  .ld-codeblock .tk-classname { color: ${t.colors.synGreen}; }
  .ld-codeblock .tk-builtin   { color: ${t.colors.synCyan}; }
  .ld-codeblock .tk-string    { color: ${t.colors.synAmber}; }
  .ld-codeblock .tk-number    { color: ${t.colors.synAmber}; }
  .ld-codeblock .tk-comment   { color: ${t.colors.fg3}; font-style: italic; }
  .ld-codeblock .tk-arrow     { color: ${t.colors.synCyan}; }
`;

export const GlobalStyles = () => <Global styles={styles} />;
