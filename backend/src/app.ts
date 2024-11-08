import Anthropic from "@anthropic-ai/sdk";
import { Router } from "express";

export const app = Router();


app.get("/", (req, res) => {
        res.send("Hello World!");
});
      

app.post("/message", async (req, res) => {
        const client = new Anthropic({
            apiKey: process.env["ANTHROPIC_API_KEY"],
        });
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
