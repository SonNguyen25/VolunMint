import { Button, Box, Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../../pages/client/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import React, {useState, useEffect} from "react";
// import { Button, ButtonGroup } from '@chakra-ui/react'

const data = ["Home", "About", "Manage Bounties", "Manage Rewards", "Manage Volunteers", "Logout"];

export default function NavBar() {
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        // Successfully signed out
        router.push("/login"); // Redirect to login page after logout
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // An error happened.
        console.error("Logout Error:", error);
        toast({
          title: "Logout failed",
          description: "Failed to log out. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  useEffect(() => {
    const fetchUserType = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsBusinessUser(userSnap.data().isBusiness);
        }
      }
    };

    fetchUserType();
  }, [user]);

  const handleNavClick = (item) => {
    if (item === "Logout") {
      handleLogout();
    } else 
    if (item === "Manage Volunteers") {
      router.push("/manage-volunteers");
    }
    else {
      router.push(`/${item.toLowerCase()}`);
    }
  };

//   return (
//     <Flex w={"100%"} align="center" justify="right" marginEnd={20}>
//       {data.map((item) => (
//         <Button
//           key={item} // Ensure each button has a unique key
//           colorScheme="teal"
//           variant="ghost"
//           onClick={() => handleNavClick(item)} // Call handleNavClick with the item name
//         >
//           {item}
//         </Button>
//       ))}
//     </Flex>
//   );
// }

return (
  <Flex align="center" justify="space-between" wrap="wrap" padding="1.5rem" color="white">
    {/* Left side of the navbar */}
    <Flex align="center" mr={5}>
      <Link href="/home" passHref>
        <Button variant="ghost" colorScheme="teal" aria-label="Home">
          Home
        </Button>
      </Link>
    </Flex>
    <Flex align="center" mr={5}>
      <Link href="/about" passHref>
        <Button variant="ghost" colorScheme="teal" aria-label="About">
          About
        </Button>
      </Link>
    </Flex>
    
    {/* Right side of the navbar */}
    <Flex align="center">
      {isBusinessUser && (
        <Link href="/manage-volunteers" passHref>
          <Button variant="ghost" colorScheme="teal" aria-label="Manage Volunteers">
            Manage Volunteers
          </Button>
        </Link>
      )  }{!isBusinessUser && (
        <>
          <Link href="/manage-bounties" passHref>
            <Button variant="ghost" colorScheme="teal" aria-label="Manage Bounties">
              Manage Bounties
            </Button>
          </Link>
          <Link href="/manage-rewards" passHref>
            <Button variant="ghost" colorScheme="teal" aria-label="Manage Rewards">
              Manage Rewards
            </Button>
          </Link>
          
        </>
      )}
      <Flex align="center" mr={5}>
        <Button variant="ghost" colorScheme="teal" aria-label="Logout" onClick={handleLogout}>
          Logout
        </Button>
    </Flex>
    </Flex>
  </Flex>
);
};

