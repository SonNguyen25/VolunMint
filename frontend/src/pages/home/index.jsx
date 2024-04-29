import { useWallet } from "@/hooks/useWallet";
import BusinessMain from "../../components/pages/business-main";
import UserMain from "../../components/pages/user-main";
import {useState, useEffect} from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NavBar from "../../components/pages/nav-bar";
import Header from "../../components/pages/header";
import { db } from '../client/firebase'; 

//ignore
import InfoSection from "./info-section";
import WallSection from "./wall-section";
import WalletSection from "./wallet-section";
import styles from "./styles.module.css";
import { useDB } from "@/contexts/DBContexts";
import Chat from "../../components/pages/chat";
import ProtectedRoute from "../../components/ProtectedRoutes";

function Home() {
    const [business, setBusiness] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(); // Ensure Firebase auth is initialized properly

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setBusiness(docSnap.data().isBusiness); // Assuming there's an 'isBusiness' field
                    console.log(business);
                } else {
                    console.log("No such document!");
                }
            } else {
                console.log("No user is signed in");
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, [business]);

    if (loading) {
        return <div>Loading...</div>; // Loading state while waiting for Firebase response
    }

    return (
        <>
            <Chat />
            {business === true ? <BusinessMain /> : <UserMain />}
        </>
    );
}

export default Home;