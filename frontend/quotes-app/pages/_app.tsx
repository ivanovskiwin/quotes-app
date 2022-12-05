import '../styles/globals.css';

import { FC, useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from "next/router";


const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);
      useEffect(() => {
        const start = () => {
          setLoading(true);
        };
        const end = () => {
          setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
          Router.events.off("routeChangeStart", start);
          Router.events.off("routeChangeComplete", end);
          Router.events.off("routeChangeError", end);
        };
      }, []);
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Head>
    <title>Quotes App</title>
    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
  </Head>
  
  return (
        <>
          {loading ? (
            <h1 style={{position: "absolute", top:"50%", left: "50%", transform: "translate(-50%, -50%)", fontSize:"30px"}}>Loading...</h1>
          ) : (
            <Component {...pageProps} />
          )}
        </>
  )
};

export default MyApp;