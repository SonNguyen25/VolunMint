import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import app, {db} from '../pages/client/firebase';
import { getAuth } from 'firebase/auth';

const DBContext = createContext();
export const useDB = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const toast = useToast();
    const auth  = getAuth(app);

    useEffect(() => {
        

        const fetchUserData = async () => {
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              // Set the fetched data as state
              setProfile(userSnap.data());
            } else {
              toast({
                title: "No user data found",
                description: "Please complete your profile.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            }
          }
        };
    
        fetchUserData();
      }, [auth, toast]);

    return (
      <DBContext.Provider value={profile}>
        {children}
      </DBContext.Provider>
    );
  };