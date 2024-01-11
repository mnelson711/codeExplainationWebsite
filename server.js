const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, "public"); 
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//PRIVATE KEY
let API_KEY;
fs.readFile("/etc/secrets/APIkey", 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading API key file:', err);
    return;
  }

  API_KEY = data.trim();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.get("/switch", (req, res) => {
  res.sendFile(__dirname + "/transfer.html");
});

app.get("/explain", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", async (req, res) => {
  const { language, code } = req.body;
  console.log(language,code);

  try {
    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const openaiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `In the programming language: ${language}, What does the following bit of code mean/do: ${code}. Please provide a response that is a valid string.`,
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

app.post("/switch", async (req, res) => {
  const { oldlanguage, newlanguage, code } = req.body;

  try {
    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const openaiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `I have code in the programming language: ${oldlanguage}. Could you transfer the code in the language ${newlanguage} so that is the same as the old but in the new language. The code is as follows: ${code} . Please just provide me with the new code and no explainations.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const responseText = openaiResponse.choices[0].message.content;
    // const responseSend = JSON.stringify({ responseText });
    // console.log("response: ", responseText);
    res.send(responseText);
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).send("Error calling OpenAI API");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
