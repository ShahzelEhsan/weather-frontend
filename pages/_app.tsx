import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { WeatherProvider } from '@/context/WeatherContext';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <WeatherProvider>
        <Component {...pageProps} />
      </WeatherProvider>
    </SessionProvider>
  );
}
