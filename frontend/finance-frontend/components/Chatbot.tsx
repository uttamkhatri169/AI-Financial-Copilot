"use client"

import { useState, useRef, useEffect } from "react"
import axios from "../lib/api"

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
    const [question, setQuestion] = useState("")
    const [messages, setMessages] = useState<any[]>([
        { role: "ai", text: "Hello! I'm your AI Financial Assistant. Ask me anything about your spending or budgets." }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping, isOpen])

    const askQuestion = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!question.trim()) return

        const userQ = question
        setMessages(prev => [...prev, { role: "user", text: userQ }])
        setQuestion("")
        setIsTyping(true)

        try {
            const res = await axios.get(`http://127.0.0.1:8000/chatbot?question=${encodeURIComponent(userQ)}`)
            const answer = res.data.answer || "I'm sorry, I couldn't process that request."
            
            setMessages(prev => [...prev, { role: "ai", text: answer }])
        } catch (error) {
            console.error("Chatbot error", error)
            setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting right now. Please try again later." }])
        } finally {
            setIsTyping(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-950 rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">FinBot AI</h3>
                        <p className="text-[10px] text-indigo-400 uppercase tracking-wider">Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5 bg-gradient-to-b from-transparent to-indigo-950/20">
                {messages.map((m, index) => (
                    <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                            m.role === "user" 
                            ? "bg-indigo-600 text-white shadow-lg rounded-tr-sm" 
                            : "bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm shadow-md backdrop-blur-sm"
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md backdrop-blur-sm">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-black/40 border-t border-white/10 backdrop-blur-xl">
                <form onSubmit={askQuestion} className="relative">
                    <input
                        type="text"
                        placeholder="Ask about your finances..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-14 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={!question.trim() || isTyping}
                        className="absolute right-1.5 top-1.5 bottom-1.5 w-10.5 h-10.5 aspect-square rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </form>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
            `}</style>
        </div>
    )
}