"use client"

import { useEffect, useState } from "react"
import axios from "../lib/api"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-gray-300 font-medium mb-1">{label}</p>
                <p className="text-pink-400 font-bold">
                    ₹{payload[0].value.toFixed(2)} <span className="text-xs text-gray-500 font-normal">predicted</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function PredictionChart({ refreshTrigger }: { refreshTrigger?: number }) {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        fetchPrediction()
    }, [refreshTrigger])

    const fetchPrediction = async () => {
        try {
            const res = await axios.get("/predict-spending")
            const prediction = res.data

            const chartData = Object.keys(prediction).map((key) => ({
                category: key,
                amount: prediction[key],
            }))

            setData(chartData)
        } catch (error) {
            console.error("Error fetching predictions", error)
        }
    }

    if (data.length === 0) {
        return (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin w-6 h-6 text-purple-500/50 mb-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-sm">Analyzing future trends...</p>
                </div>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.4}/>
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
                <Bar dataKey="amount" fill="url(#colorPred)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}