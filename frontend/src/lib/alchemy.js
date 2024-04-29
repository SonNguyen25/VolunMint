import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Adjust according to your target network
};

const alchemy = new Alchemy(config);

export default alchemy;