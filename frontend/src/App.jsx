import { useState, useRef, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";

function App() {

  const [ socket , setSocket] = useState(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      text : "hellow How is s fjlsj ",
      timestamp : new Date().toLocaleString(),
      sender :"bot"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user' // added sender
    }

    setMessages(prev => [...prev, newMessage])

    // SOCKET SE EMIT KARWA RAHE HAI INPUT TEXT => SERVER [SOCKET.IO SE]
    socket.emit('lala-ai', { prompt: inputValue })
    setInputValue('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // SOKET KO INITIATE KATE TIME HI USSE CONNECT HO HAYENGE
  // http://localhost:3000/socket.io/?EIO=4&transport=polling&t=llratiqk' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on('ai-message', (response) => {

      // Handle case when response is an object (like {batao: "text"})
      const text = typeof response === 'object' && response !== null
        ? response.batao || JSON.stringify(response)
        : response;

      const botMessage = {
        id: Date.now() + 1,
        text: text,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }

      setMessages(prevMessage => [...prevMessage, botMessage])

    })

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Application</h1>
        <p className="subtitle">Start a conversation</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start typing to begin!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message message-${message.sender}`}>
              <div className="message-content">
                <p className="message-text">
                  {typeof message.text === 'object' ? JSON.stringify(message.text) : message.text}
                </p>
                <span className="message-time">{message.timestamp}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          className="message-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows="3"
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={inputValue.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
