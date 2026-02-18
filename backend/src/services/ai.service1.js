// THIS PACKAGE NAME SERVICES BECAUSE ON  SPPED OR GOOD MODELS CHANGES ON WITH THE TIME 
// require('dotenv').config()

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

//ABSTRACTION

async function generateResponse(chatHistory){
    const response = await ai.models.generateContent({
        model   : 'gemini-2.0-flash',
        contents : [
                { role: "user", content: chatHistory }
            ],

    })
    return response.text();
}


module.exports = generateResponse