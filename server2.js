import OpenAI from "openai";

API_KEY = "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";
const openai = new OpenAI({
  apiKey: API_KEY,
});

const chatCompletion = await openai.chat.completions.create({
  messages: [
    {
      role: "user",
      content: `In the programming language: ${language}, What does the following bit of code mean/do: ${code}. Please provide a detailed response`,
    },
  ],
  model: "gpt-3.5-turbo",
});
