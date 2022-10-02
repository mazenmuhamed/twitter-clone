import { AppProps } from 'next/app';
import { CacheProvider } from '@emotion/react';
import { ChakraProvider } from '@chakra-ui/react';
import createCache from '@emotion/cache';
import Router from 'next/router';
import Head from 'next/head';

import progress from '../lib/progress-bar';
import '../styles/globals.css';

// Progress bar
Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

const emotionCache = createCache({
  key: 'emotion-css-cache',
  prepend: true, // ensures the cache is prepended to the head, not appended
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Twitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CacheProvider value={emotionCache}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}

export default MyApp;
