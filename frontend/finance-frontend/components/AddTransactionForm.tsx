"use client"

import { useState } from "react"
import axios from "../lib/api"

export default function AddTransactionForm({ refresh }: { refresh: (msg?: string) => void }) {
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!amount || !category || !description) return

        setIsSubmitting(true)
        try {
            await axios.post("/transactions", {
                amount: Number(amount),
                category: category,
                description: description,
                payment_method: "UPI"
            })

            setAmount("")
            setCategory("")
            setDescription("")
            refresh("Expense added successfully!")
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const predictCategory = async (text: string) => {
        if (!text || text.length < 3) return
        try {
            const res = await axios.get(`/predict-category?description=${text}`)
            if (res.data.category) setCategory(res.data.category)
        } catch (err) {
            console.error("Prediction error", err)
        }
    }

    return (
        <div>
            <h4 className="text-xs font-semibold text-indigo-300/80 mb-3 uppercase tracking-wider">Manual Entry</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-indigo-400 transition-colors font-medium">₹</span>
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="glass-input pl-8 py-2.5 text-sm"
                    />
                </div>

                <div className="relative">
                    <input
                        type="text"
                        required
                        placeholder="Description (e.g. Starbucks)"
                        value={description}
                        onChange={(e) => {
                            const text = e.target.value
                            setDescription(text)
                            if (text.length > 2) predictCategory(text)
                        }}
                        className="glass-input py-2.5 text-sm"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                    <input
                        type="text"
                        required
                        placeholder="Category (Auto-predicted)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="glass-input pl-9 py-2.5 text-sm bg-indigo-500/5 focus:bg-white/5" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full glass-button py-2.5 text-sm flex justify-center items-center mt-2 border border-white/10"
                >
                    {isSubmitting ? (
                        <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Add Expense'}
                </button>
            </form>
        </div>
    )
}