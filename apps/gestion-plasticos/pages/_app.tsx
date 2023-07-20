import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import NavBar from './components/navbar';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to gestion-plasticos!</title>
      </Head>
      <main className="flex flex-col h-screen">
        <NavBar />
        <Component className="flex-1" {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
