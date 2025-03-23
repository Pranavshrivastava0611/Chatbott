'use client'

import { Bot, Send, User } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";

export default function Home() {
  
  interface Message {
    text: string;
    sender: 'user' | 'bot';
  }

  const [input, setInput] = useState<string>("");
  const [message, setMessage] = useState<Message[]>([]);
  const [response, setResponse] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPending, setPending] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [message, isPending]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // ✅ Ensure sender type is correctly assigned
    const newMessages: Message[] = [...message, { text: input, sender: 'user' }];
    setMessage(newMessages);
    setInput('');

    try {
      setPending(true);
      const res = await fetch('/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      setMessage([...newMessages, { text: data.message, sender: 'bot' }]);
      setResponse(data.response);
      setPending(false);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to send message. Please try again.');
      setPending(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-black flex flex-col">
      {/* Navbar */}
      <div className="bg-zinc-700 rounded-sm h-11 flex justify-center items-center font-bold font-san ">
        <h1 className="text-transparent bg-clip-text text-3xl font-bold bg-gradient-to-r from-purple-800 to bg-pink-700 animate-pulse">
          LATEST CHATBOT
        </h1>
      </div>

      {/* Message Display */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {message.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Bot size={20} className="text-zinc-900" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-100 border border-purple-500'
            } shadow-lg ${
              message.sender === 'user'
                ? 'shadow-cyan-500/50'
                : 'shadow-purple-500/50'
            } transition-all duration-300 ease-in-out animate-fadeIn`}>
              <Suspense fallback={<Loader />}>{message.text.split("*").join(".")}</Suspense>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <User size={20} className="text-zinc-900" />
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Animation */}
        {isPending && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Bot size={20} className="text-zinc-900" />
            </div>
            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-zinc-800 text-zinc-100 border border-purple-500 shadow-lg shadow-purple-500/50 transition-all duration-300 ease-in-out">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-zinc-800 border-t border-zinc-700">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out placeholder-zinc-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-zinc-900 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-500/50">
            <Send size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
