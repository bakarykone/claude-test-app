import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";

const client = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const app = express();
const port = 5000;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/message", async (req, res) => {
  console.log(req);
  try {
    const message = await client.messages.create({
      max_tokens: 1024,
      messages: [{ role: "user", content: req.body.message }],
      model: "claude-3-5-sonnet-20240620",
    });

    res.json(message.content);
  } catch (error) {
    res.json([
      {
        type: "text",
        content: "Je suis désolé, je n'ai pas compris votre message.",
      },
    ]);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
