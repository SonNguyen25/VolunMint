// components/WalletEmbed.js
import alchemy from '@/lib/alchemy';
import React, { useEffect } from 'react';

const WalletEmbed = () => {
  useEffect(() => {
    console.log(alchemy, "wtf"); 
    // Initialize the Embedded Wallet
    alchemy.embeddedWallet.init();

    // Optionally, customize the wallet's appearance and behavior
    alchemy.embeddedWallet.setConfig({
      theme: 'dark', // or 'light'
    });

  }, []);

  return (
    <div id="alchemy-embedded-wallet"></div>
  );
};

export default WalletEmbed;
