"use client"

import { useEffect, useState } from "react"
import axios from "../lib/api"

export default function BudgetRecommendations({ refreshTrigger }: { refreshTrigger?: number }) {
    const [budgets, setBudgets] = useState<any>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBudgets()
    }, [refreshTrigger])

    const fetchBudgets = async () => {
        try {
            const res = await axios.get("/recommend-budgets")
            setBudgets(res.data)
        } catch (error) {
            console.error("Error fetching budget recommendations", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-teal-500/20 transition-all duration-500"></div>
            
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                AI Budget Plan
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-pulse flex space-x-4 w-full">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                ) : Object.keys(budgets).length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No budget recommendations yet.</p>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(budgets).map(([category, amount]: [string, any], index) => (
                            <div key={category} className="group/item flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/30">
                                        {category.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-200 group-hover/item:text-white transition-colors">{category}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-teal-400">₹{parseFloat(amount).toFixed(2)}</span>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Suggested</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    )
}