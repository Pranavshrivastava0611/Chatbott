'use client'

import Image from "next/image";
import { useCallback, useRef, useState,useEffect } from "react";
import{Send,User,Bot} from "lucide-react"
import { cors } from "hono/cors";
import { useRouter } from "next/router";
import { handle } from "hono/cloudflare-pages";

export default function Home() {

  

  interface Message {

    text : string ,
    sender : 'user' | 'bot';
  }

  const [input,setinput] = useState<string>("");
  const [message,setmessage] = useState<Message[]>([]);
  const  [response,setResponse] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [message]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages  = [...message, { text: input, sender: 'user' }];
    setmessage(newMessages);
    setinput('');

    try {
      console.log(input)
      const res = await fetch('/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      console.log(res)
      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      console.log(data)
      setmessage([...newMessages, { text: data.message, sender: data.sender }]);
      setResponse(data.response);
      setinput('');
      
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to send message. Please try again.');
    }
  };



  return (
    <>
    <main className="h-screen w-screen bg-black flex flex-col">
      {/*navbar */}
      <div className="bg-zinc-700 rounded-sm h-11 flex justify-center items-center font-bold font-san ">
        <h1 className="text-transparent bg-clip-text text-3xl font-bold bg-gradient-to-r from-purple-800 to bg-pink-700 animate-pulse">
          LATEST CHATBOT
        </h1>
      </div>
      {/*input div */}
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
              {message.text.split("*").join(".")}
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <User size={20} className="text-zinc-900" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/*message div */}
      <div className="p-4 bg-zinc-800 border-t border-zinc-700">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out placeholder-zinc-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setinput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            onClick={handleSendMessage}
          />
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-zinc-900 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-pink-500/50">
            <Send size={20} />
          </button>
        </div>
      </div>
    </main>
    </>
  );
}
