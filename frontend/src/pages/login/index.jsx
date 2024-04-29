import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../client/firebase";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContexts";
import { useRouter } from "next/router";

export default function Login({setIsLoggedIn, setLoading}) {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  // const user = useAuth();

  // useEffect(() => {
  //   if (user) {
  //   }
  // }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await auth.setPersistence(browserSessionPersistence);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);

        const checkUser = async () => {
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setIsLoggedIn(docSnap);
            setLoading(false);
            router.push("/home");
          } else {
            router.push("/create-profile");
          }
        };

        checkUser();
        toast({
          title: "Login Successfully!",
          description: "You're logged in!",
          status: "success",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Caught error:", error);
        toast({
          title: "Login Error",
          description: errorMessage,
          status: "error",
        });
      });
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    await auth.setPersistence(browserSessionPersistence);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          console.log(token);
        }
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        const userRef = doc(db, "users", user.uid);

        const checkUser = async () => {
          setLoading(true)
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setIsLoggedIn(docSnap)
            router.push('/home')
          } else {
            // navigate("/questions");
            setIsLoggedIn(null);
          }

          setLoading(false)
        };

        checkUser();
        toast({
          title: "Log in with Google successfully!",
          description: `Welcome, ${user.displayName}`,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error(error.message);
        toast({
          title: "Unable to login with Google",
          description: error.message,
          status: "error",
        });
      });
  };

  const handleRegister  = () => {
    router.push('/register')
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
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
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleRegister}
              >
                Create a new account
              </Button>
              <Button
                data-testid="loginButton"
                leftIcon={<FcGoogle />}
                onClick={handleGoogleSignIn}
                colorScheme="yellow"
                variant="outline"
                mb={2}
                marginBottom="25px"
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
