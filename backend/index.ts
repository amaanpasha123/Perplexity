import { tavily } from "@tavily/core";
import { Output, streamText } from "ai";
import "dotenv/config";
import express from "express";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";
import z, {  string } from "zod";
import { prisma } from "./db";
import { middleware } from "./middleware";
import cors from "cors";
import { create } from "node:domain";
import { StatementSync } from "node:sqlite";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();
app.use(express.json());
app.use(cors());

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove non-word chars
    .replace(/[\s_-]+/g, "-")   // collapse whitespace/underscores into single dash
    .replace(/^-+|-+$/g, "");   // trim leading/trailing dashes
}

//Past Conversations get
app.get("/conversations", middleware, async (req, res) => {
  const conversation = prisma.conversation.findMany({
    where: {
      userId: req.userId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });
  res.json({ conversation });
});

//past conversation get
app.get("/conversation/:conversationId", middleware, async (req, res) => {
  const conversationIdParam = req.params.conversationId;
  const conversationId = Array.isArray(conversationIdParam)
    ? conversationIdParam[0]
    : conversationIdParam;

  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required" });
  }

  prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId: req.userId,
    },
  });
});

app.post("/purplexity_ask", middleware, async (req, res) => {
  //Step-1 get query from the user
  const query = req.body.query; //give the best rust resources

  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  const webSearchResponse = await client.search(query, {
    searchDepth: "advanced",
  });

  const webSearchResult = webSearchResponse.results;

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  //do associate stream with presistance conversation id
  const conversation = await prisma.conversation.create({
    data: {
      title: query.slice(0, 80),
      slug: String(slugify(query)),
      userId: userId,
      Messages: {
        create: { content: query, role: "User" },
      },
    },
  });

  //Step-5 do some context engineering on the prompt + web search responses...

  //Step-6 hit the llm and stream back the response......

  const prompt = PROMPT_TEMPLATE.replace(
    "{{WEB_SEARCH_RESULTS}}",
    JSON.stringify(webSearchResult),
  ).replace("{{USER_QUERY}}", query);

  const result = streamText({
    model: "openai/gpt-5.4-mini",
    prompt: prompt,
    system: SYSTEM_PROMPT,
    output: Output.object({
      schema: z.object({
        followUps: z.array(z.string()),
        answer: z.string(),
      }),
    }),
  }); // ✅ close streamText call here

  res.header("Cache-Control", "no-cache");
  //   res.header("Content-Type", "text/event-stream");

  for await (const textPart of result.textStream) {
    res.write(textPart); //text must be given in stream format
  }

  res.write("<SOURCES>");

  //Step-7 also stream back the sources and the follow up questions .....(which we will get from another prallell LLM also)

  res.write(
    JSON.stringify(webSearchResult.map((result) => ({ url: result.url }))),
  );

  res.write("</SOURCES>");

  //step-8 Close the event stream.....
  res.end();
});

app.post("/purplexity_ask/follow_up", middleware, async (req, res) => {
  //step1 get the existing chat from the data base
  //step2 forward the full histroy to the llm
  //step2.5 TODO: - Do context Engineering here....
  //step3 stream the response to the user
});

app.listen(3001, () => {
  console.log("working");
});
