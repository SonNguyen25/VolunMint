// const bodyParser = require('body-parser');
// require('dotenv').config();
// const { ethers } = require('ethers');
// const express = require('express');
// const app = express();
// app.use(bodyParser.json());
// const cors = require('cors');
// app.use(cors());

// app.use(express.static('public'));

// // Configuration
// const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contractAddress = '0x815c1EF8c7596a6bD0e145c7Ee5BeEA18e5e3657';

// const abi = [
//     "function createBounty(uint bountyId, string memory description, uint256 rewardAmount, address[] memory participants) public",
//     "function claimBounty(uint bountyId, address claimant) public",
//     "function getActiveBounties() public view returns (uint[] memory)",
//     "function getBounty(uint bountyId) public view returns (uint256, string memory, uint256, bool)",
//     "function getBountyCount() public view returns (uint)",
//     "function listBountyTitles() public view returns (string[] memory)",
//     "function deactivateBounty(uint bountyId) public"
// ];

// // Connecting to the contract
// const contract = new ethers.Contract(contractAddress, abi, wallet);

// // Function to create a bounty
// async function createBounty(description, rewardAmount, participants) {
//     try {
//         const tx = await contract.createBounty(description, rewardAmount, participants);
//         await tx.wait();
//         console.log(`Bounty created with description: ${description}`);
//     } catch (error) {
//         console.error("Failed to create bounty:", error);
//     }
// }

// // Function to create a bounty
// async function deactivateBounty(bountyId) {
//     try {
//         const tx = await contract.deactivateBounty(bountyId);
//         await tx.wait();
//         console.log(`Deleted Bounty: ${bountyId}`);
//     } catch (error) {
//         console.error("Failed to delete bounty:", error);
//     }
// }

// // // Function to claim a bounty
// // async function claimBounty(bountyId, claimant) {
// //     try {
// //         const tx = await contract.claimBounty(bountyId, claimant);
// //         await tx.wait();
// //         console.log(`Bounty ${bountyId} claimed by ${claimant}`);
// //     } catch (error) {
// //         console.error("Failed to claim bounty:", error);
// //     }
// // }

// async function claimBounty(bountyId, walletAddress) {
//     try {
//         const response = await fetch('/claim-bounty', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ bountyId, walletAddress })
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Bounty claimed successfully:', data);
//         } else {
//             const error = await response.json();
//             console.error('Error claiming bounty:', error);
//         }
//     } catch (error) {
//         console.error('Failed to send request:', error);
//     }
// }

// async function getBountyCount() {
//     try {
//         const count = await contract.getBountyCount();
//         console.log("Total number of bounties:", count.toString());
//     } catch (error) {
//         console.error("Failed to retrieve bounty count:", error);
//     }
// }

// // Function to get the active bounties
// async function displayActiveBounties() {
//     try {
//         const activeBounties = await contract.getActiveBounties();
//         console.log("Active Bounties IDs:", activeBounties);
//     } catch (error) {
//         console.error("Failed to get active bounties:", error);
//     }
// }

// // Function to get a specific bounty
// async function getBounty(index) {
//     try {
//         const bounty = await contract.getBounty(index);
//         console.log(`Bounty at index ${index}:`, bounty);
//     } catch (error) {
//         console.error("Failed to get bounty:", error);
//     }
// }

// // Function to list all bounty titles
// async function listBountyTitles() {
//     try {
//         const titles = await contract.listBountyTitles();
//         console.log("All Bounty Titles:", titles);
//     } catch (error) {
//         console.error("Failed to list bounty titles:", error);
//     }
// }

// // Example usage
// async function main() {
//     const participants = ['0x49aB40823824DdEBc0a984669a8fB76C0452d122']; // Replace with actual addresses
//     await createBounty("Clean the Park", 1, participants);
//     await getBountyCount();
//     await listBountyTitles();
//     await getBounty(0); // Get the first bounty
//     await claimBounty(0, '0x49aB40823824DdEBc0a984669a8fB76C0452d122');
// }

// // Function to create a bounty and listen for the event
// async function createBounty(bountyid, description, rewardAmount, participants) {
//     try {
//         const txResponse = await contract.createBounty(bountyid, description, rewardAmount, participants);
//         console.log('Transaction sent, waiting for confirmation...');
//         const receipt = await txResponse.wait();
//         console.log("Bounties created!")
//     } catch (error) {
//         console.error("Failed to create bounty:", error);
//     }
// }

// async function getBountyCount() {
//     try {
//         const count = await contract.getBountyCount();
//         console.log(`Total number of bounties: ${count}`);
//         return count;
//     } catch (error) {
//         console.error("Failed to get bounty count:", error);
//     }
// }

// // Function to get a specific bounty
// async function getBounty(bountyid) {
//     try {
//         const bounty = await contract.getBounty(bountyid);
//         console.log(`Bounty at id ${bountyid}:`, bounty);
//     } catch (error) {
//         console.error("Failed to get bounty:", error);
//     }
// }

// // createBounty(71, "test event description", 10, ['0xB3Ea9452FdEFbE20FC6c5DcBDec576CEA3E87283'])
// // getBountyCount();
// // displayActiveBounties();
// // claimBounty(69, "0x49aB40823824DdEBc0a984669a8fB76C0452d122")
// // deactivateBounty(69)
// // Route to handle the POST request

// app.post('/claim-bounty', async (req, res) => {
//     const { bountyId, walletAddress } = req.body;

//     try {
//         const tx = await contract.claimBounty(bountyId, walletAddress);
//         await tx.wait();
//         res.json({ message: `Bounty ${bountyId} claimed by ${walletAddress}` });
//     } catch (error) {
//         console.error("Failed to claim bounty:", error);
//         res.status(500).json({ error: "Failed to claim bounty" });
//     }
// });

// app.post('/create-bounty', async (req, res) => {
//     const { bountyId, description, rewardAmount, participants } = req.body;

//     try {
//         const tx = await contract.createBounty(bountyId, description, rewardAmount, participants);
//         await tx.wait();
//         res.json({ message: `Bounty ${bountyId} created successfully with description: ${description}` });
//     } catch (error) {
//         console.error("Failed to create bounty:", error);
//         res.status(500).json({ error: "Failed to create bounty" });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import { ethers } from "ethers";
import nextCors from "nextjs-cors";

export default async function handler(req, res) {
  await nextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "POST") {
    const { bountyId, walletAddress } = req.body;
    const provider = new ethers.JsonRpcProvider(
      "https://rpc-amoy.polygon.technology/"
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractAddress = "0x1176Fb22153CE3DcAe0eb3f76Cf0bEb4D25d234e";
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
      const tx = await contract.claimBounty(bountyId, walletAddress);
      await tx.wait();
      res
        .status(200)
        .json({ message: `Bounty ${bountyId} claimed by ${walletAddress}` });
    } catch (error) {
      console.error("Failed to claim bounty:", error);
      res.status(500).json({ error: "Failed to claim bounty" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
