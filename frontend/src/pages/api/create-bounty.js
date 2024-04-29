import { ethers } from 'ethers';
import nextCors from 'nextjs-cors';

export default async function handler(req, res) {
    await nextCors(req, res, {
        methods: ['POST'],
        origin: '*',
        optionsSuccessStatus: 200,
    });

    if (req.method === 'POST') {
        const { bountyId, description, rewardAmount, participants } = req.body;
        const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contractAddress = '0x1176Fb22153CE3DcAe0eb3f76Cf0bEb4D25d234e';
        const abi = [
            "function createBounty(uint bountyId, string memory description, uint256 rewardAmount, address[] memory participants) public",
            "function claimBounty(uint bountyId, address claimant) public",
            "function getActiveBounties() public view returns (uint[] memory)",
            "function getBounty(uint bountyId) public view returns (uint256, string memory, uint256, bool)",
            "function getBountyCount() public view returns (uint)",
            "function listBountyTitles() public view returns (string[] memory)",
            "function deactivateBounty(uint bountyId) public",
          ];
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        try {
            const tx = await contract.createBounty(bountyId, description, rewardAmount, participants);
            await tx.wait();
            res.status(200).json({ message: `Bounty ${bountyId} created successfully with description: ${description}` });
        } catch (error) {
            console.error("Failed to create bounty:", error);
            res.status(500).json({ error: "Failed to create bounty" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
