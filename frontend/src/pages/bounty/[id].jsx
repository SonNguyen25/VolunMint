import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Button,
  Flex,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../client/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Bounty() {
  const router = useRouter();
  const { id } = router.query;
  const [bounty, setBounty] = useState({});

  const handleRequest = async () => {
    // Call API to send request
    const auth = getAuth(); // Get the Firebase Auth service instance
    const user = auth.currentUser; // Get the currently signed-in user

    if (user && id) { // Check if user is logged in and id is available
        const bountyRef = doc(db, "bounties", id); // Get a reference to the bounty document
        try {
            await updateDoc(bountyRef, {
                participants: arrayUnion(user.uid) // Add the user's UID to the participants array
            });
            alert("Request sent successfully!");
        } catch (error) {
            console.error("Error sending request:", error);
            alert("Failed to send request. Please try again.");
        }
    } else {
        alert("You need to be signed in to register for a bounty!");
    }
};


  //Call API here
  useEffect(() => {
    async function fetchBounty() {
      if (id) { 
        try {
          const docRef = doc(db, "bounties", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists) {
            setBounty({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log("No such document!");
            setBounty({});
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    }

    fetchBounty();
  }, [id]);

  // Example reward data
   const reward = {
    imageUrl: "https://via.placeholder.com/500",
    title: "Exclusive Reward Package",
    description: "Experience the ultimate in luxury and convenience with our exclusive reward package. Perfect for those who appreciate the finer things in life.",
    price: "$299"
  };

  return (
    <Flex
      direction={["column", "column", "row"]}
      p={5}
      maxW="container.xl"
      mx="auto"
    >
      <Box flex="1">
        <Image src={reward.imageUrl} alt={`Reward ${id}`} borderRadius="md" />
      </Box>
      <VStack flex="1" alignItems="start" px={5} spacing={4}>
        <Heading as="h1">{bounty.event}</Heading>
        <Text fontSize="lg">{bounty.description}</Text>
        {bounty.isActive ? <Badge colorScheme="green">Active</Badge> : <Badge colorScheme="red">Unavailable</Badge>}
        <Text fontSize="2xl" fontWeight="bold">
          {bounty.rewardAmount} BUSC / hour volunteering
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => {
            alert("Sent a request!");
            handleRequest();
          }}
        >
          Register for bounty
        </Button>
      </VStack>
    </Flex>
  );
}
