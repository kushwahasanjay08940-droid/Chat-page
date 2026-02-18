require('dotenv').config();

const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const  generateResponse = require('./src/services/ai-service')

// TWO SERVER HTTP SERVER FRONTEND SERVER 

const io = new Server(httpServer, {
      cors : {
        origin : "http://localhost:5173",  //adust
    }
});

  

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);



    // LONG TERM MEMORY WE USE RAG [TOUGH]


    // SHORT TERM MEMORY

     const chatHistory = []
    
    // CREATING OLD HISTERY FOR REVISTE OLD MEMORY DURING CHAT  SHORT TERM MEMORY

// OPENROUTERE CHATHISTORY FORMAT 



// const chatHistory = [{ role: "user", content: "Hello" },
// { role: "assistant", content: "Hi" }]


   


// GEMINAI CHATHISTORY FORMAT  


// const chatHistory = [{
//     role : "user",
//     parts : [{ text : 'who was the pm of INDIA in 2019 ?'}]
// },
// {
//     role : "model",
//     parts : [
//         {
//             text : " The Prime Minister of India in 2019 was **Narendra Modi"
//         },
//     ]
// }]

//HTTP SERVER + WEBSOCKET SERVER ON

// JAB SERVER SE EK NAYA CONNECTION BUILD KIYA JAE TAB YE EVENT[CONNECTION EVENT]
//  FIRE HOGA OR THEN YE CALLBACKCHAL JAYEGA

// BUILD-IN EVENT




   

// BUILD-IN EVENTS

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });


    // CUSTOM EVENTS

    // socket.on("messages"  , () => {
    //         console.log("messge recieved")
    // })

    // EVEN FIRE HERE   LIKE FHUFHA KO FIRE KAR DO 

    //  LALA KA LISTENER LAGAYA HAI SERVER PAR DATA AYEGA CALLBACK PAR


    // CUSTUM EVENT SE BACKEND ME DATA SEND KARNA

    // socket.on("lala"  , (data) => {
    //         console.log("messge recieved by LALA"  , data)
    // })


    // CUSTUM EVENTS

    socket.on('ai-message'  , async (data) => {

        try {
            
             console.log("Recieved AI Message" , data.prompt)
        const response = await generateResponse(data.prompt);
        console.log("AI Response"  , response)

        // ADD LISTENER ON EVENT AI-EMIT-RESPONSE ON POSTMAN TO LISTEN

        socket.emit("ai-message-response"  , {response});

        } catch (error) {

                //WHY 401 ERROR HAPPEN => API KEY MISSING (MOST COMMON)

            console.log("AI error"  , error.message);
            socket.emit("ai-message-response" , {
               response: "AI failed to respond"
            })
        }
       
    })



// ANOTHER LALA AI 
// CUSTUM EVENT

    socket.on('lala-ai'  , async (data) => {

        
       try {
         console.log("Recevid data of Lala AI"  , data.prompt)



        //  GEMINAI  HISTORY STORE FORMAT 

        //  chatHistory.push({
        //     role: 'user',
        //     parts: '[{text : data}]'
        //  })


        // OPEN ROUTER AI FORMAT TO PUSH BEFORE DATA

        // USER MESSAGE ADD HERE 

         chatHistory.push({
        role: "user",
        content: data.prompt
    });



            // THIS FOR GEMENAI 

         const batao = await generateResponse(chatHistory)

        // OPEN ROUTES HERE 

        //  const batao = await generateResponse([
        //     {
        //         role: "user",
        //         content : data.prompt
        //     }
        //  ])





         // OPEN ROUTER AI FORMAT TO PUSH AFTER DATA FOR MAKE SHORT MEMORY

            chatHistory.push({
                role : "assistant",
                content : batao
            })


         console.log("Lala AI Find => "  ,batao )
 
         socket.emit('ai-message'  , {batao})
       } catch (error) {
        console.log("AI error"  , error.message)

        // EVIT FIRE HERE MAT-KAR LALA  LISTENER
        // LISTENER LAGANE SE DATA FRONTEND ME JATA HAI 


        // socket.emit('ai-message' , {})

        socket.emit("ai-message" , {
            response : "AI failed to respond"
        })
       }
        
    })


});


httpServer.listen(3000 , () => {
    console.log("server is running on port 3000")
})

