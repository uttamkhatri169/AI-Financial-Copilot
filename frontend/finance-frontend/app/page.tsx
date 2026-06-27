"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TransactionTable from "../components/TransactionTable"
import Chatbot from "../components/Chatbot"
import EditProfileModal from "../components/EditProfileModal"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [userName, setUserName] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [currencyKey, setCurrencyKey] = useState("INR")

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("token")
    if (!token || token === "undefined") {
      router.push("/auth/login")
    } else {
      setHasToken(true)
      setUserName(localStorage.getItem("name") || "User")
      setCurrencyKey(localStorage.getItem("currency") || "INR")
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    localStorage.removeItem("currency")
    router.push("/auth/login")
  }

  const handleProfileUpdated = (updatedName: string, updatedCurrency: string) => {
    setUserName(updatedName)
    setCurrencyKey(updatedCurrency)
  }

  // Prevent hydration errors by not rendering until mounted and verified
  if (!mounted || !hasToken) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen"></div>

      {/* Modern Dashboard Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/[0.02] border-b border-white/[0.08] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">AI Component</h1>
                <p className="text-xs text-indigo-300/80 font-medium">Financial Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/[0.08] transition-colors cursor-pointer border-transparent">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                <span className="text-sm font-medium text-gray-300">System Online</span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] active:bg-white/[0.05] transition-all cursor-pointer shadow-inner group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-semibold text-gray-200 hidden sm:inline-block pr-1">{userName || "User"}</span>
                  <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-950/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setIsEditProfileOpen(true)
                          setIsProfileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                      >
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Edit Profile
                      </button>
                      <hr className="border-white/5 my-1" />
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsChatOpen(true)}
                className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/30 hover:text-indigo-300 transition-colors border border-indigo-500/30 relative group"
                title="Open FinBot AI"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                {/* Notification dot */}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 border-2 border-[--background] rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <TransactionTable key={currencyKey} />
      </main>

      {/* Global Chatbot Slide-over */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  )
}