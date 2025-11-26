import { useState } from 'react';
import Head from 'next/head';
import PasskeyTest from '@/components/PasskeyTest';
import SmartWalletVerification from '@/components/SmartWalletVerification';

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
          Passkey integration ready! Test Passkey functionality and verify your smart wallet below.
        </p>
        
        <SmartWalletVerification 
          contractId={process.env.NEXT_PUBLIC_WALLET_CONTRACT_ID}
        />
        
        <div style={{ marginTop: '3rem' }}>
          <h2>Basic Passkey Test</h2>
          <PasskeyTest />
        </div>
      </main>
    </>
  );
}

