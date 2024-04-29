import { Flex, Text, List, ListItem } from "@chakra-ui/react";
import Card from "./card";
import { useRouter } from "next/router";
import Link from "next/link";

import { db } from '../../../pages/client/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { getAuth } from 'firebase/auth';


const auth = getAuth();
// async function addBountiesToFirestore(bountyDataArray) {
  // const addedDocs = [];
//   for (const bountyData of bountyDataArray) {
//       try {
//           const docRef = await addDoc(collection(db, "bounties"), bountyData);
//           console.log("Document written with ID: ", docRef.id);
//           addedDocs.push({ id: docRef.id, ...bountyData });
//       } catch (e) {
//           console.error("Error adding document: ", e);
//       }
//   }
//   return addedDocs;
// }

// const data = [
//     {
//       "event": "Park Cleanup Drive",
//       "amount": 50,
//       "starRating": 4.5,
//       "numReviews": 22,
//       "prize": "Free lunch from a local cafe",
//       "status": "New"
//     },
//     {
//       "event": "Local Library Organization",
//       "amount": 30,
//       "starRating": 4.0,
//       "numReviews": 18,
//       "prize": "Book vouchers",
//       "status": "Not new"
//     },
//     {
//       "event": "Senior Tech Help Day",
//       "amount": 40,
//       "starRating": 4.8,
//       "numReviews": 15,
//       "prize": "Coffee shop gift card",
//       "status": "New"
//     },
//     {
//       "event": "Community Garden Tending",
//       "amount": 35,
//       "starRating": 4.2,
//       "numReviews": 12,
//       "prize": "Gardening supplies gift pack",
//       "status": "Not new"
//     },
//     {
//       "event": "Neighborhood Beautification",
//       "amount": 45,
//       "starRating": 4.7,
//       "numReviews": 25,
//       "prize": "Local store discount coupons",
//       "status": "New"
//     }
//   ]
  
export default function   UserMain() {
  const [data, setData] = useState([]);
  const [rewards, setRewards] = useState([]);
  useEffect(() => {
    // addBountiesToFirestore(data)
    //     .then(addedDocs => console.log('Added documents:', addedDocs))
    //     .catch(e => console.error('Error in adding documents:', e));
    const fetchBounties = async () => {
      const bounties = await getDocs(collection(db, "bounties"));
      const bountyData = bounties.docs.map(doc =>  ({
        id: doc.id,
        ...doc.data()
      }));
      setData(bountyData);
      console.log('Fetched bounties:', bountyData);
    };
    fetchBounties();

    const fetchRewards = async () => {
      const reward = await getDocs(collection(db, "rewards"));
      const rewardsData = reward.docs.map(doc =>  ({
        id: doc.id,
        ...doc.data()
      }));
      setRewards(rewardsData);
      console.log('Fetched rewards:', rewardsData);
    };
    fetchRewards();
},  []);
    return (
      <div>
        {/* This is for bounties */}
        <Flex margin={30} align="center" justify="center">
            <Text color='black' fontSize='5xl'> Bounties </Text>
        </Flex>
        <Flex align="center" justify="center">
          {data.map( (bounty) => (
          <Link key={bounty.id} href={`bounty/${bounty.id}`} passHref>
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


        {/* This is for rewards */}
        <Flex margin={20} align="center" justify="center">
            <Text color='black' fontSize='5xl'> Rewards </Text>
        </Flex>
        <Flex align="center" justify="center">
          {rewards.map( (reward) => (
          <Link key={reward.id} href={`reward/${reward.id}`} passHref>
             <Card
              id={reward.id}
              event={reward.company}
              numReviews={reward.type}
              amount={reward.description}
              status={reward.isRedeemed}
              description={reward.description}
              type = 'reward'
            />
          </Link>
          ))}
        </Flex>
      </div>
    )
}
