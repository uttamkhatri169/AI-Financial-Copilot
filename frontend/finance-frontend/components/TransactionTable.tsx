"use client"

import { useEffect, useState } from "react"
import axios from "../lib/api"
import AddTransactionForm from "./AddTransactionForm"
import SpendingChart from "./SpendingChart"
import PredictionChart from "./PredictionChart"
import AnomalyAlert from "./AnomalyAlert"
import BudgetRecommendations from "./BudgetRecommendations"
import CSVUpload from "./CSVUpload"
import Toast from "./Toast"

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [toastMessage, setToastMessage] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [isTableExpanded, setIsTableExpanded] = useState(false)

    const fetchTransactions = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get("/transactions")
            setTransactions(res.data)
        } catch (error) {
            console.error("Failed to fetch transactions", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const handleRefresh = (message?: string) => {
        fetchTransactions()
        setRefreshTrigger(prev => prev + 1)
        if (message) {
            setToastMessage(message)
            setShowToast(true)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
            {/* Top row: Alerts and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AnomalyAlert refreshTrigger={refreshTrigger} />
                </div>
                <div className="lg:col-span-1">
                    <div className="glass-card h-full p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <CSVUpload refresh={handleRefresh} />
                            <AddTransactionForm refresh={handleRefresh} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 tracking-wide">
                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        Spending Overview
                    </h3>
                    <div className="h-[300px] w-full relative">
                        <SpendingChart refreshTrigger={refreshTrigger} />
                    </div>
                </div>
                <div className="glass-card p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 tracking-wide">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        Future Predictions
                    </h3>
                    <div className="h-[300px] w-full relative">
                        <PredictionChart refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>

            {/* Bottom row: Table and Side Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Transaction Table */}
                <div className="xl:col-span-2 glass-card p-6 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            Recent Transactions
                        </h3>
                        <div className="text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            {transactions.length} Records
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/10 flex-1 relative bg-black/20">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                            </div>
                        ) : null}
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-sm uppercase tracking-wider backdrop-blur-md">
                                    <th className="p-4 font-semibold w-24">ID</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                {transactions.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No transactions found. Add one above!
                                        </td>
                                    </tr>
                                ) : (
                                    (isTableExpanded ? transactions : transactions.slice(0, 5)).map((t) => (
                                        <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 text-xs font-mono text-gray-500 group-hover:text-indigo-400 transition-colors">#{t.id}</td>
                                            <td className="p-4 font-medium text-white flex items-center gap-1">
                                                <span className="text-gray-500 text-xs">$</span>
                                                {t.amount?.toFixed ? t.amount.toFixed(2) : t.amount}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-indigo-300">
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400 group-hover:text-gray-200 transition-colors">
                                                {t.description}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {transactions.length > 5 && (
                        <div className="mt-4 flex justify-center border-t border-white/5 pt-4">
                            <button 
                                onClick={() => setIsTableExpanded(!isTableExpanded)}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-white/5"
                            >
                                {isTableExpanded ? (
                                    <>Collapse <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg></>
                                ) : (
                                    <>View All {transactions.length} Transactions <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Automation & Insights Side Panel */}
                <div className="xl:col-span-1 space-y-6 flex flex-col h-full">
                    <div className="flex-1 min-h-[400px]">
                        <BudgetRecommendations refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>
        </div>
    )
}