const axios = require("axios");


// ABSTRACTION GOES HERE

async function generateResponse(chatHistory) {

    try {
        const res = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct",
                messages: chatHistory
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout : 30000
    
            }
        );
    
        return res.data.choices[0].message.content;
    } catch (error) {
        if( error.code == "ECONNRESET" ){
            console.log("connection reset by api key ");
            return "API server busy .Try again"
        }
        throw error;
    }
}

module.exports = generateResponse;
