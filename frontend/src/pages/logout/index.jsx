import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

const Logout = () => {
    const auth = getAuth();
    const router = useRouter();
    const toast = useToast();

    const handleLogout = async () => {
        signOut(auth).then(() => {
            // Successfully signed out
            router.push('/login');  // Redirect to login page after logout
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }).catch((error) => {
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

    return (<></>
    );
};

export default Logout;
