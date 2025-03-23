
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(request : Request) {
const comment = await request.json();
console.log(comment.message)
const genAI = new GoogleGenerativeAI("AIzaSyBc68ADfkKSQY7xc6oDo50R7NyNSdKehmU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = comment.message;

const result = await model.generateContent(prompt);
console.log(result.response.text());
return new Response(JSON.stringify({
  message : result.response.text(),
  sender : "bot",
}))
}
