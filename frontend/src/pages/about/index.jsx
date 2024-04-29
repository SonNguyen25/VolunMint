// pages/about.js
import { Box, Container, Heading, Text, Image } from '@chakra-ui/react';

export default function About() {
  return (
    <Container maxW="container.md" py={5}>
      <Heading as="h1" mb={5}>About Us</Heading>
      {/* <Image borderRadius="full" boxSize="150px" src="/path-to-your-image.jpg" alt="Company Image" mb={5} /> */}
      <Text fontSize="lg" lineHeight="tall">
        Welcome to VolunMint, where we aim to promote social connectivity and empathy by offering a service that helps volunteers as well as the local community around Boston.
        Founded in 2024, we have grown from a small student 4 student group to a large community of volunteers and organizations.
      </Text>
      <Text mt={4}>
        Our team is dedicated to create a huge positive impact on the community of Boston.
         {/* and we pride ourselves on  */}
        {/* [highlight unique aspects such as customer service, innovation, or community involvement]. */}
      </Text>
      <Text mt={4}>
        Thank you for visiting our website.
         {/* We hope to support you with [describe products or services offered]  */}
        {/* and invite you to join us in [describe a call to action or company vision]. */}
      </Text>
    </Container>
  );
}
