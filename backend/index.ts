import express from "express";
const app = express();

app.post("/purplexity_ask", (req, res)=>{
    //Step-1 get query from the user 
    const query = req.body;

    //Step-2 make sure the user has the access/credits to hit the endpoint.


    //Step-3 check we have web search index for the similar query or not...


    //Step-4 if no the do web search to gather the resources.....


    //Step-5 do some context engineering on the prompt + web search responses...


    //Step-6 hit the llm and stream back the response......


    //Step-7 also stream back the sources and the follow up questions .....(which we will get from another prallell LLM also)


})

app.listen(3000);