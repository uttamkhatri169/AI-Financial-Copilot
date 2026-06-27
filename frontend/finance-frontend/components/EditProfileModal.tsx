"use client"

import { useState, useEffect } from "react"
import axios from "../lib/api"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    onProfileUpdated: (name: string, currency: string) => void
}

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("Student")
    const [financialRange, setFinancialRange] = useState("")
    const [currency, setCurrency] = useState("INR")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            fetchProfile()
        }
    }, [isOpen])

    const fetchProfile = async () => {
        try {
            const res = await axios.get("/profile")
            if (res.data) {
                setName(res.data.name || "")
                setEmail(res.data.email || "")
                setStatus(res.data.status || "Student")
                setFinancialRange(res.data.financial_range || "")
                setCurrency(res.data.currency || "INR")
            }
        } catch (err) {
            console.error("Failed to load profile", err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await axios.put("/profile", {
                name,
                email,
                status,
                financial_range: financialRange,
                currency
            })

            if (res.data.error) {
                setError(res.data.error)
                return
            }

            localStorage.setItem("name", name)
            localStorage.setItem("currency", currency)
            onProfileUpdated(name, currency)
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred while updating profile")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-card w-full max-w-md p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                {/* Glow blobs */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Edit Profile
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="glass-input text-sm py-2 px-3"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input text-sm py-2 px-3"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Occupation Status</label>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setFinancialRange("") // reset range
                            }}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        >
                            <option className="bg-gray-950 text-white" value="Student">Student</option>
                            <option className="bg-gray-950 text-white" value="Working Professional">Working Professional</option>
                        </select>
                    </div>

                    {status === "Student" ? (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Monthly Pocket Money</label>
                            <select
                                value={financialRange}
                                onChange={(e) => setFinancialRange(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                            >
                                <option className="bg-gray-950 text-white" value="">Select Range</option>
                                <option className="bg-gray-950 text-white" value="Under ₹2,000">Under ₹2,000</option>
                                <option className="bg-gray-950 text-white" value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                                <option className="bg-gray-950 text-white" value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                                <option className="bg-gray-950 text-white" value="₹10,000+">₹10,000+</option>
                            </select>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Monthly Income Range</label>
                            <select
                                value={financialRange}
                                onChange={(e) => setFinancialRange(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                            >
                                <option className="bg-gray-950 text-white" value="">Select Range</option>
                                <option className="bg-gray-950 text-white" value="Under ₹25,000">Under ₹25,000</option>
                                <option className="bg-gray-950 text-white" value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                                <option className="bg-gray-950 text-white" value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                                <option className="bg-gray-950 text-white" value="₹1,00,000+">₹1,00,000+</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Preferred Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        >
                            <option className="bg-gray-950 text-white" value="INR">INR (₹)</option>
                            <option className="bg-gray-950 text-white" value="USD">USD ($)</option>
                            <option className="bg-gray-950 text-white" value="EUR">EUR (€)</option>
                            <option className="bg-gray-950 text-white" value="GBP">GBP (£)</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 glass-button py-2.5 text-sm flex justify-center items-center font-semibold"
                        >
                            {isLoading ? (
                                <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
