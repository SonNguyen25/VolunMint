
import OpenAI from "openai";
import "dotenv/config";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: 'sk-proj-bm6rs5LdueSvCno2S7vdT3BlbkFJZZOjvnF9W7OJdNDM49rBB' });

  const conversation = [];
  const savedExercises = [];

export default async function chatGenerator(req, res){
  
  // OPENAI API
  try {
  if (req.method === 'POST') {
    const { message } = req.body;
    const userMessage = req.body;
    conversation.push(userMessage);
    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-4",
    });
    const choice = completion.choices[0];
    conversation.push(choice.message);
    res.json(choice.message);
  
    res.status(200).json({ reply: "Response from OpenAI" });
} else if (req.method === 'GET') {
    res.json(conversation)
    res.status(200).json({ message: "This is a GET request response" });
} else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
} catch (error) {
console.error('API error:', error);
res.status(500).json({ error: "Internal Server Error", details: error.message });
}
}