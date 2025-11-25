import { useState } from 'react';
import Head from 'next/head';
import PasskeyTest from '@/components/PasskeyTest';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stellar Smart Wallet - Production Lot Registry</title>
        <meta name="description" content="Smart Wallet MVP for Production Lot Registry" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Stellar Smart Wallet</h1>
        <p>Production Lot Registry MVP</p>
        <p style={{ marginBottom: '2rem' }}>
          Passkey integration ready! Test Passkey functionality below.
        </p>
        <PasskeyTest />
      </main>
    </>
  );
}

