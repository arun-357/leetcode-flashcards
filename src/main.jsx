import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import App from './App.jsx';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      500: '#2B6CB0',
      600: '#2C5282',
      700: '#1A4971',
    },
    card: {
      light: 'gray.100',
      dark: 'gray.800',
    },
    bg: {
      light: 'yellow.50',
      dark: 'gray.900',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.600' },
          _dark: {
            bg: 'brand.700',
            color: 'white',
            _hover: { bg: 'brand.600' },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          bg: { base: 'card.light', _dark: 'card.dark' },
        },
      },
    },
    CardHeader: {
      baseStyle: {
        bg: { base: 'gray.100', _dark: 'gray.800' },
        borderTopRadius: 'lg',
      },
    },
    CardBody: {
      baseStyle: {
        bg: { base: 'gray.100', _dark: 'gray.800' },
        borderBottomRadius: 'lg',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: { base: 'bg.light', _dark: 'bg.dark' },
        color: { base: 'gray.800', _dark: 'gray.100' },
        transitionProperty: 'background-color, color',
        transitionDuration: '0.2s',
      },
      pre: {
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxW: '100%',
        fontSize: { base: 'sm', md: 'md' },
      },
      code: {
        fontFamily: `'Source Code Pro', monospace`,
        fontSize: { base: 'sm', md: 'md' },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>
);