import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Heading,
  Center,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../client/firebase";
import { useRouter } from "next/router";

const CreateProfile = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    industry: "",
    preferences: "",
    isBusiness: false,
    company: "",
    request: [],
    claim: [],
  });

  const questions = [
    { label: "What is your name?", name: "name", displayName: "name" },
    { label: "What is your email?", name: "email", displayName: "email" },
    { label: "You are a volunteer? Answer in true or false", displayName: "role", name:"isBusiness"},
    { label: "What is the name of your company/institution? Answer N/A if not identified.", displayName: "company", name: "company"},
    {
      label: "What is your major? If not, what is the industry you're currently working in/interested?",
      name: "industry", displayName: "major/industry"
    },
    { label: "List out your interests and hobbies", displayName: "preferences", name: "preferences"},
  ];

  const toast = useToast();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, profile);
        toast({
          title: "Profile Updated Successfully",
          description: "Your profile has been updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await setDoc(userRef, profile);
        toast({
          title: "Profile Created Successfully",
          description: "Your profile has been created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    router.push('/home');
  };

  return (
    <Center flexDirection="column" mt="5">
      <VStack spacing={8} w="full" maxW="lg" p={8}>
        {showIntro ? (
          <Box textAlign="center">
            <Heading mb={10}>Lets Build Your Profile</Heading>
            <Button colorScheme="blue" onClick={() => setShowIntro(false)}>Start</Button>
          </Box>
        ) : (
          <Box as="form" w="full" >
            <Heading mb={4}>Profile Questions</Heading>
            <FormControl isRequired>
              <FormLabel>{questions[currentIndex].label}</FormLabel>
              <Input
                id={`${questions[currentIndex].name}Input`}
                name={questions[currentIndex].name}
                value={profile[questions[currentIndex].name]}
                onChange={handleChange}
                placeholder={`Enter your ${questions[currentIndex].displayName}`}
              />
            </FormControl>
            <Stack direction="row" mt={4} justify="space-between">
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
                isDisabled={currentIndex === 0}
              >
                Previous
              </Button>
              {currentIndex === questions.length - 1 ? (
                <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => setCurrentIndex(Math.min(currentIndex + 1, questions.length - 1))}
                >
                  Next
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </VStack>
    </Center>
  );
};

export default CreateProfile;
