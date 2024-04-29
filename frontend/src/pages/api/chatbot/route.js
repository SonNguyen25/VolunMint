// import OpenAI from "openai";
// import "dotenv/config";
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function chatGenerator() {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   const conversation = [];
//   const savedExercises = [];
//   // OPENAI API
//   const getConversation = () => NextApiResponse.json(conversation);

//   const postChat = async () => {
//     const userMessage = NextApiRequest.body;
//     conversation.push(userMessage);
//     const completion = await openai.chat.completions.create({
//       messages: conversation,
//       model: "gpt-4",
//     });
//     const choice = completion.choices[0];
//     conversation.push(choice.message);
//     NextApiResponse.json(choice.message);
//   };
// }
// app.get("/api/chatbot/conversation", getConversation);
// app.post("/api/chatbot/conversation", postChat)

import { Configuration, OpenAIApi } from "openai";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req = NextRequest) {
  // Initialize OpenAI client
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  // This could be stored in a database or some persistent storage in a real application
  const conversation = [];

  if (req.method === 'GET') {
    // Return the current conversation
    NextResponse.status(200).json({ conversation });
  } else if (req.method === 'POST') {
    // Handle new chat message
    const userMessage = req.body.message; // Make sure to send a message in the body
    conversation.push({ role: "user", content: userMessage });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: conversation,
      });

      const botMessage = completion.data.choices[0].message.content;
      conversation.push({ role: "assistant", content: botMessage });

      NextResponse.status(200).json({ botMessage });
    } catch (error) {
      NextResponse.status(500).json({ message: "Error processing your message", error: error.message });
    }
  } else {
    NextResponse.setHeader('Allow', ['GET', 'POST']);
    NextResponse.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
