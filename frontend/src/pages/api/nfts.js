// pages/api/nfts.js
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,  // Use environment variables to secure the API key
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);

export default async function handler(req, res) {
  try {
    const ownedNfts = await alchemy.nft.getNftsForOwner("vitalik.eth");
    res.status(200).json(ownedNfts.ownedNfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
}
