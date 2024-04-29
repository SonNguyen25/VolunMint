import { Box, Image, Badge } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";

export default function Card({
  id,
  event,
  amount,
  starRating,
  numReviews,
  status,
  type,
  description,
}) {
  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}
  const property = {
    imageUrl: "https://bit.ly/2Z4KKcF",
    imageAlt: "Rear view of modern home with pool",
    activeParticipants: getRandomNumber(),
    remainingRewards: getRandomNumber(),
    title: event,
    formattedPrice: type === "bounty" ? `${amount} BUSC` : `${amount}`,
    reviewCount: type === "bounty" ? getRandomNumber() : numReviews,
    rating: starRating,
    status: status,
    type: type,
    description: description,
  };
  const [image, setImage] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');


  return (
    <Box
      boxShadow="xl"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      margin={2}
    >
      <Image
        src={property.imageUrl
        }
        alt={property.imageUrl}
        width="300px" 
        height="200px" 
        objectFit="fill"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {property.status ? (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              Active
            </Badge>
          ) : (
            <Badge borderRadius="full" px="2" colorScheme="red">
              INACTIVE
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="9.2px"
            textTransform="uppercase"
            ml="2"
          >
            {property.type !== "reward"
              ? `${property.activeParticipants} active volunteers \u2022 ${property.remainingRewards} spots left`
              : ""}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {property.title}
        </Box>

        <Box>
          {property.type === "reward"
            ? property.formattedPrice
            : `${property.formattedPrice}`}
          <Box as="span" color="gray.600" fontSize="sm"></Box>
        </Box>

        <Box display="flex" mt="2" alignItems="center">
          {(property.type === 'bounty') && Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? "teal.500" : "gray.300"}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm" >
            {property.type !== "reward"
              ? `${property.reviewCount} reviews`
              : `Cost: ${property.reviewCount} BUSC` }
          </Box>
          <Button colorScheme="teal" variant="outline" size="sm" ml="auto">
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
