import { tavily } from "@tavily/core";
import { Output, streamText } from "ai";
import 'dotenv/config';
import express from "express";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";
import z, { string } from "zod";


const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const app = express();
app.use(express.json());

app.post("/purplexity_ask", async (req, res) => {
  //Step-1 get query from the user
  const query = req.body.query; //give the best rust resources

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

app.post("/purplexity_ask", async (req, res) => {
  const result = streamText({
    model: 'openai/gpt-5.4',
    prompt: prompt,
    system: SYSTEM_PROMPT,
    output: Output.object({
      schema: z.object({
        followUps: z.array(z.string()),
        answer: z.string(),
      }),
    }),
  }); // ✅ close streamText call here

  for await (const textPart of result.textStream) {
    res.write(textPart);
  }

  res.write("-----------SOURCES--------------\n");


  //Step-7 also stream back the sources and the follow up questions .....(which we will get from another prallell LLM also)

  webSearchResult.forEach(result => res.write(JSON.stringify(result)));

});


});


app.listen(3000, () => {
  console.log("working");
});
