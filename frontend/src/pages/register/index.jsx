import React, { useState } from 'react';
import {
  Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, useColorModeValue, useToast
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import {
  getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, browserSessionPersistence
} from 'firebase/auth';
import { useRouter } from 'next/router';
import app from '../client/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const toast = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await auth.setPersistence(browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast({
        title: 'Log in with Google successfully!',
        description: `Welcome, ${user.displayName}`,
        status: 'success',
        isClosable: true,
        duration: 3000
      });
      router.push('/create-profile');
    } catch (error) {
      console.error(error.message);
      toast({
        title: 'Unable to login with Google',
        description: error.message,
        status: 'error'
      });
    }
  };

  const handleRegister = async () => {
    try {
      await auth.setPersistence(browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Sign up successfully!',
        description: 'Account created successfully!',
        status: 'success'
      });
      router.push('/create-profile');
    } catch (error) {
      console.error('Error in account creation:', error.message);
      toast({
        title: 'Error in account creation',
        description: error.message,
        status: 'error'
      });
    }
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await updateDoc(userRef, {email: email});
          toast({
            title: "Profile Updated Successfully",
            description: "Your profile has been updated.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          await setDoc(userRef, {email: email});
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
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Register your account</Heading>
          <Text fontSize="lg" color="gray.600">
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg="blue.400"
                color="white"
                _hover={{ bg: 'blue.500' }}
                onClick={handleRegister}
              >
                Register
              </Button>
              <Button
                data-testid="googleLoginButton"
                leftIcon={<FcGoogle />}
                onClick={handleGoogleSignIn}
                colorScheme="yellow"
                variant="outline"
              >
                <Text mb="0">Continue with Google</Text>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
