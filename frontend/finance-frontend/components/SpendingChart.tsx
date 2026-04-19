"use client"

import { useEffect, useState } from "react"
import axios from "../lib/api"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-gray-300 font-medium mb-1">{label}</p>
                <p className="text-indigo-400 font-bold">
                    ₹{payload[0].value.toFixed(2)}
                </p>
            </div>
        );
    }
    return null;
};

export default function SpendingChart({ refreshTrigger }: { refreshTrigger?: number }) {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        fetchData()
    }, [refreshTrigger])

    const fetchData = async () => {
        try {
            const res = await axios.get("/transactions")
            const transactions = res.data
            const categoryTotals: any = {}

            transactions.forEach((t: any) => {
                if (!categoryTotals[t.category]) {
                    categoryTotals[t.category] = 0
                }
                categoryTotals[t.category] += t.amount
            })

            const chartData = Object.keys(categoryTotals).map((key) => ({
                category: key,
                amount: categoryTotals[key],
            }))

            setData(chartData)
        } catch (error) {
            console.error("Error fetching chart data", error)
        }
    }

    if (data.length === 0) {
        return (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>Not enough data to display</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis 
                    dataKey="category" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                />
                <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                <Bar dataKey="amount" fill="url(#colorAmount)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}