import React, { useEffect, useState } from "react";
import { Flex, Text, Spacer } from "@chakra-ui/react";
import Link from "next/link";
import Card from "./card";
import { useRouter } from "next/router";

import { db } from '../../../pages/client/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@chakra-ui/react";

const auth = getAuth();

export default function BusinessMain() {
  const [data, setData] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [company, setCompany] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setCompany(userData.company);  // Assuming userData.company is not null or undefined
          } else {
            console.log("No user data available");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is signed in");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (company) {
      const fetchBounties = async () => {
        const bountiesSnapshot = await getDocs(collection(db, "bounties"));
        const bounties = bountiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(bounty => bounty.company.toLowerCase() === company.toLowerCase());
        setData(bounties);
      };
      fetchBounties();

      const fetchRewards = async () => {
        const rewardsSnapshot = await getDocs(collection(db, "rewards"));
        const rewards = rewardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(reward => reward.company.toLowerCase() === company.toLowerCase());
        setRewards(rewards);
      };
      fetchRewards();
    }
  }, [company]);

  return (
    <div>
      {/* Bounties Section */}
      <Flex align="center" justify="center" position="relative" height="100px" marginX={30}>
  <Text color='black' fontSize='5xl'> Bounties </Text>
  <Button colorScheme="blue" variant="solid" size="md" position="absolute" right={0} onClick={() => router.push('/bounty/create')}>
    Create Bounty
  </Button>
</Flex>
      
      <Flex align="center" justify="center">
        {data.map((bounty) => (
          <Link passHref key={bounty.id} href={`bounty/${bounty.id}`} >
            <Card
              id={bounty.id}

              event={bounty.event}
              amount={bounty.rewardAmount}
              starRating={Math.floor(Math.random() * 10) / 2 + 1}
              numReviews={Math.floor(Math.random())}
              prize={bounty.rewardAmount}
              status={bounty.isActive}
              type = 'bounty'
              description = {bounty.description}
            />
          </Link>
        ))}
      </Flex>

      {/* Rewards Section */}
      <Flex margin={20} align="center" justify="center">
        <Text color='black' fontSize='5xl'> Rewards </Text>
      </Flex>
      <Flex align="center" justify="center">
        {rewards.map((reward) => (
          <Link key={reward.id} href={`reward/${reward.id}`} passHref>
            <Card
              id={reward.id}
              event={reward.company}
              numReviews={reward.coins}
              amount={reward.description}
              status={reward.isRedeemed}
              description={reward.description}
              type = 'reward'
            />
          </Link>
        ))}
      </Flex>
    </div>
  );
}
