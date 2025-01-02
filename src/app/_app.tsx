import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light', // Changez à 'dark' pour un thème sombre
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}
