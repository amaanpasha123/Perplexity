import { tavily } from "@tavily/core";
import { Output, streamText } from "ai";
import "dotenv/config";
import express from "express";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";
import z, { string } from "zod";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();
app.use(express.json());

//Signup
app.post("signup", async(req, res)=>{

});

//Signin
app.post("signin", async(req, res)=>{

});

//Past Conversations get
app.get("/conversations", async(req, res)=>{
   
});

//past conversation get
app.get("/conversation/:conversationId", async(req, res)=>{

})

app.post("/purplexity_ask", async (req, res) => {
  //Step-1 get query from the user
  const query = req.body.query; //give the best rust resources

  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  //Step-2 make sure the user has the access/credits to hit the endpoint.

  //Step-3 check we have web search index for the similar query or not...

  //Step-4 if no the do web search to gather the resources.....

  const webSearchResponse = await client.search(query, {
    searchDepth: "advanced",
  });

  const webSearchResult = webSearchResponse.results;
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

  res.write(JSON.stringify(webSearchResult.map(result => ({url : result.url}))));

  res.write("</SOURCES>");

  //step-8 Close the event stream.....
  res.end();

});

app.post("/purplexity_ask/follow_up", async (req, res)=>{
    //step1 get the existing chat from the data base
    //step2 forward the full histroy to the llm
    //step2.5 TODO: - Do context Engineering here.... 
    //step3 stream the response to the user 

})

app.listen(3000, () => {
  console.log("working");
});
