"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const res = await axios.post("http://127.0.0.1:8000/signup", {
                email,
                password,
                name
            })
            
            if (res.data.error) {
                setError(res.data.error)
                return
            }

            setSuccess("Signup successful! Redirecting to login...")
            setTimeout(() => {
                router.push("/auth/login")
            }, 1500)
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred during signup")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="glass-card w-full max-w-md p-8 relative z-10 border-t-white/20">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-inner">
                        <span className="text-3xl">💰</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm">Sign up for your AI Financial Copilot</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center backdrop-blur-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center backdrop-blur-md">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="glass-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`glass-button mt-4 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Sign Up'}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-400">
                            Already have an account? <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}