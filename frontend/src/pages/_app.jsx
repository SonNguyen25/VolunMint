import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import WalletProvider from '@/components/providers/wallet';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AuthProvider } from "@/contexts/AuthContexts";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import app from './client/firebase';
import LoadingScreen from '@/components/loading';
import Login from './login';
import Register from './register';  // Assuming you have a Register component
import CreateProfile from './create-profile';
import {useRouter} from 'next/router';
import { db } from './client/firebase';

function App({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid); // Correctly reference the user's document
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setCurrentUser({ uid: user.uid, ...docSnap.data() }); // Set user with data from Firestore
            router.push('/home');
          } else {
            router.push('/create-profile'); // Navigate to profile creation if not data
          }
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      } else {
        setCurrentUser(null); // No user is signed in
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);


  if (loading) {
    return <LoadingScreen />;
  }

  if (currentUser === null && loading === false) {
    // If there is no current user and the requested page is login or register
    if (Component === Login || Component === Register || Component === CreateProfile) {
      return (
        <ChakraProvider>
          <Component setIsLoggedIn={setCurrentUser} setLoading={setLoading} {...pageProps} />
        </ChakraProvider>
      );
    }
    // else {
    //   // Redirect to Login if trying to access a different page
    //   return (
    //     <ChakraProvider>
    //       <Login setIsLoggedIn={setCurrentUser} setLoading={setLoading}/>
    //     </ChakraProvider>
      // );
    }
  

  // Render the main app if the user is logged in
  return (
    <ChakraProvider>
      <AuthProvider>
        <WalletProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
