"use client"

import { useEffect, useState } from "react"
import axios from "../lib/api"

export default function AnomalyAlert({ refreshTrigger }: { refreshTrigger?: number }) {
    const [anomalies, setAnomalies] = useState<any[]>([])

    useEffect(() => {
        fetchAnomalies()
    }, [refreshTrigger])

    const fetchAnomalies = async () => {
        try {
            const res = await axios.get("/detect-anomalies")
            setAnomalies(res.data)
        } catch (error) {
            console.error("Error fetching anomalies", error)
        }
    }

    if (anomalies.length === 0) return null

    return (
        <div className="relative overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] p-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 animate-pulse border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-red-400 tracking-wide text-shadow">Unusual Spending Detected</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                {anomalies.map((a) => (
                    <div key={a.id} className="bg-red-950/40 border border-red-500/20 rounded-xl p-4 flex items-center justify-between hover:bg-red-900/40 transition-colors shadow-sm">
                        <div>
                            <p className="text-xs text-red-200/60 mb-1 uppercase tracking-wider font-semibold">Transaction #{a.id}</p>
                            <p className="text-white font-medium">{a.description}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-red-400">₹{a.amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}