import { useEffect, useState } from "react";
import { useToast, Heading, VStack, Box, Text, } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";

import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { db } from "../client/firebase";

export default function ManageBounties() {
  const [bounties, setBounties] = useState([]);
  const [claims, setClaims] = useState([]);
  const toast = useToast();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedClaimIndex, setSelectedClaimIndex] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const onOpenModal = (index) => {
    setSelectedClaimIndex(index);
    setModalOpen(true);
  }
  
   // Function to submit claim to the API
   const submitClaimToAPI = async (bountyId, walletAddress) => {
    try {
      const response = await fetch('/api/claim-bounty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bountyId: 15,
          walletAddress: walletAddress
        })
      });

      if (!response.ok) {
        throw new Error('Failed to claim bounty');
      }

      const data = await response.json();
      toast({
        title: "Bounty Claimed",
        description: `Bounty successfully claimed.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Claim Failed",
        description: "Failed to claim the bounty. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  // Function to handle the submission of the claim
  const onClaimSubmit = () => {
    const bountyId = claims[selectedClaimIndex].id; // Assuming each claim in `claims` state has an ID
    submitClaimToAPI(bountyId, walletAddress);

    setModalOpen(false);
  }
  

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to manage bounties.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const fetchBounties = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        console.log("No such document for the user!");
        return;
      }
      const bountiesSnapshot = await getDocs(
        query(
          collection(db, "bounties"),
          where("participants", "array-contains", user.uid)
        )
      );
      const bountiesData = bountiesSnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        const isPending = data.request && data.request.includes(user.uid);
        return {
          id: docSnapshot.id,
          event: data.event,
          status: isPending ? "Pending" : "Verify",
        };
      });
      setBounties(bountiesData);
    };

    fetchBounties();
    const fetchClaims = async () => {
        const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userClaims = userSnap.data().claim || [];
      setClaims(userClaims);
    };

    fetchClaims();
  }, [user, toast]);

  const handleSubmitClaim = async (walletAddress) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to claim rewards.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setModalOpen(false);
      return;
    }
  
    try {
      const newClaims = [...claims]; // Copy the existing claims
      newClaims.splice(selectedClaimIndex, 1); // Remove the claimed amount
  
      await updateDoc(userRef, {
        claims: newClaims // Update the claims array in the user document
      });
  
      setClaims(newClaims); // Update local state
      setModalOpen(false); // Close the modal
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        title: "Claim Submission Failed",
        description: "Failed to submit your claim. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleVerify = async (bountyId) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to verify bounties.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        request: arrayUnion(bountyId),
      });
      // Optimistically update the UI
      const updatedBounties = bounties.map((bounty) => {
        if (bounty.id === bountyId) {
          return { ...bounty, status: "Pending" };
        }
        return bounty;
      });
      setBounties(updatedBounties);
      toast({
        title: "Bounty Request to be Verified",
        description: "The bounty has been successfully added to your requests.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating user requests:", error);
      toast({
        title: "Request Failed",
        description: "Failed to send verification of bounty. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack spacing={8} m={5}>
      <Heading as="h1" size="xl" my={5} textAlign="center">
        Manage Bounties
      </Heading>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submit Your Wallet Address</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Wallet Address</FormLabel>
            <Input placeholder="Enter your wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClaimSubmit}>
            Send
          </Button>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

      {claims.map((claimAmount, index) => (
        <Box
          key={index}
          p={5}
          shadow="xl"
          borderWidth="2px"
          borderRadius="lg"
          bgGradient="linear(to-r, teal.100, orange.100)"
          width="1000px"
          height="160px"
        >
          <VStack align="stretch">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Claim Amount: {claimAmount} BUSC
            </Text>
            <Button
              mt={3}
              colorScheme="blue"
              size="sm"
              onClick={() => onOpenModal(index)}
            >
              Claim
            </Button>
          </VStack>
        </Box>
      ))}

      {bounties.map((bounty) => (
        <Box
          key={bounty.id}
          p={5}
          shadow="xl"
          borderWidth="2px"
          borderRadius="lg"
          bgGradient="linear(to-r, teal.100, orange.100)"
          width="1000px"
          height="160px"
        >
          <VStack align="stretch">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Event: {bounty.event}
            </Text>
            <Button
              mt={3}
              colorScheme={bounty.status === "Verify" ? "green" : "yellow"}
              size="sm"
              onClick={() => handleVerify(bounty.id)}
            >
              {bounty.status}
            </Button>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}
