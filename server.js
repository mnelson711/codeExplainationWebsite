const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, "public"); 
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//PRIVATE KEY
API_KEY = "API-KEY-HERE";
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", async (req, res) => {
  const { language, code } = req.body;

  try {
    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const openaiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `In the programming language: ${language}, What does the following bit of code mean/do: ${code}. Please provide a detailed response`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const responseText = openaiResponse.choices[0].message.content;
    console.log("response: ", responseText);
    res.send(responseText);

  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).send("Error calling OpenAI API");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
