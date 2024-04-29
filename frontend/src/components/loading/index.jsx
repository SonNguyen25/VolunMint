import { Center, Spinner, Text, Box } from '@chakra-ui/react';

const LoadingScreen = () => {
    return (
        <Center height="100vh" flexDirection="column">
            <Spinner boxSize={60}/>
            <Text fontSize="xl" marginTop="40" color="blue.500">
                Logging you in...
            </Text>
        </Center>
    );
};

export default LoadingScreen;

