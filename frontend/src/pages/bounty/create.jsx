import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    useToast,
    Heading,
    Flex
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { db, app } from "../client/firebase"; // Adjust the path according to your project structure
  import { collection, addDoc } from "firebase/firestore";
  import { doc, getDoc } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  
  const CreateEntry = () => {
    const [profile, setProfile] = useState({ name: "", industry: "", preferences: "", isBusiness: "", company: "" });
    const [formData, setFormData] = useState({
      event: "",
      description: "",
      rewardAmount: 0,
      isActive: true,
      company: "",
      participants: [],
    });
    const toast = useToast();
    const auth = getAuth(app); // Get the auth instance

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, "bounties"), formData);
        toast({
          title: "Success",
          description: "New bounty created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        setFormData({
          title: "",
          description: "",
          amount: 0,
          isActive: true
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    };
  
    useEffect(() => {
      const fetchUser = async () => { 
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            console.log("User data:", userDoc.data());
            setProfile(userDoc.data());
            setFormData(prev => ({...prev, company: userDoc.data().company}));
          } else {
            console.log("No user data available");
          }
        }
      };
      fetchUser();
    }, [auth]);
  
    return (
      <Flex direction="column" p={5} maxWidth="500px" mx="auto">
        <Heading mb={6}>{`Create New Bounty`}</Heading>
        <Box as="form" onSubmit={handleSubmit}>
          <FormControl isRequired mb={3}>
            <FormLabel>Title</FormLabel>
            <Input name="event" value={formData.event} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={formData.description} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Amount of BUSC mint-able for 1 hour</FormLabel>
            <Input name="rewardAmount" type="number" value={formData.rewardAmount} onChange={handleChange} />
          </FormControl>
         
          <Button mt={4} colorScheme="blue" type="submit">Create Bounty</Button>
          {/* <Button mt={4} ml={3} colorScheme="gray" onClick={() => setType(type === 'bounty' ? 'reward' : 'bounty')}>
            Switch to {type === 'bounty' ? 'Reward' : 'Bounty'}
          </Button> */}
        </Box>
      </Flex>
    );
  };
  
  export default CreateEntry;
  