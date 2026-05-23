import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import App from './App/index.jsx';
import { GlobalStyles } from './styles/GlobalStyles.jsx';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
  },
  fonts: {
    heading: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`,
    body: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`,
    mono: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`,
  },
  colors: {
    brand: {
      500: '#7ee787',
      600: '#6bd474',
      700: '#3fb950',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#0a0d12',
        color: '#e6edf3',
        fontFamily: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`,
      },
      pre: {
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxW: '100%',
      },
      code: {
        fontFamily: `'JetBrains Mono', 'Fira Code', ui-monospace, monospace`,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ChakraProvider>
  </>
);
