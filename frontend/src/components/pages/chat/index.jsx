import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  Spinner,
  useDisclosure,
  IconButton,
  Portal,
} from '@chakra-ui/react';
import { FaComments, FaTimes } from 'react-icons/fa';
import Draggable from 'react-draggable';
import * as client from './client';

function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {content: "wtf asdfkjasd fasd fasjdflk adsfsljdf asld flkajsdlf askldjf alksdjfklas djfklasdj flasjdfklajs dklfjaskdlfjalksd jfklas djfklasj dklfj aslkdjf lasdjf klasjd flkajs dlkfj askldjf klasdj fklasjd fklasj dflkasjd fklajsdlkfj aklsdj flkasdj fklasd jfklasjd flkasj dfklasj dflkajs dflkjsadlkfjalsdf jalskd flasdj flkasdj flkasdj fklasd jfklasdjlkagj lksdjgf lkawje ", role: "user"},
    {content: "asdf ajskdlfja sdfklasdjfkl;aj sdfja skldfj asd;lkfj asjlk ", role: "sfd"}, {content: "asdf ", role: "sfd"} ]);
  const [message, setMessage] = useState('');
  const { isOpen, onToggle, onClose } = useDisclosure();

  const sendMessage = async () => {
    setIsLoading(true);
    const userMessage = {
      role: 'user',
      content: message,
    };
    const response = await client.postMessage(userMessage);
    setConversation([...conversation, userMessage, response]);
    setMessage('');
    setIsLoading(false);
  };

  const getConversation = async () => {
    setIsLoading(true);
    const fetchedConversation = await client.getConversation();
    setConversation(fetchedConversation);
    setIsLoading(false);
  };

  useEffect(() => {
    getConversation();
  }, []);

  return (
    <Portal>
      <Draggable handle=".handle">
        <VStack
          position="fixed"
          bottom="4"
          right="4"
          p={4}
          bg="white"
          borderRadius="lg"
          spacing={4}
          shadow="md"
          maxWidth="300px"
          zIndex="popover"
        >
          <IconButton

            marginLeft={isOpen ? "80%" : 0}
            aria-label="Open Chat"
            icon={isOpen ? <FaTimes/> : <FaComments />}
            onClick={onToggle}
            className="handle"
            isRound
            size={isOpen ? "sm" : "lg"}
          />
          {isOpen && (
            <>
              <VStack
                spacing={2}
                overflowY="auto"
                maxH="500px"
                w="full"
                p={2}
                bg="gray.100"
                borderRadius="md"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  conversation.map((msg, index) => (
                    <Text key={index} bg={msg.role === 'user' ? 'blue.200' : 'green.200'} p={2} borderRadius="md" alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
                      <strong>{msg.role.toUpperCase()}: </strong>{msg.content}
                    </Text>
                  ))
                )}
              </VStack>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
            </>
          )}
        </VStack>
      </Draggable>
    </Portal>
  );
}

export default Chat;
