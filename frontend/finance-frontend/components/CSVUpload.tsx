"use client"

import { useState } from "react"
import axios from "../lib/api"

export default function CSVUpload({ refresh }: { refresh: (msg?: string) => void }) {
    const [isUploading, setIsUploading] = useState(false)

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("file", file)

        setIsUploading(true)

        try {
            await axios.post("http://127.0.0.1:8000/upload-csv", formData)
            refresh("CSV uploaded successfully! New transactions added.")
            e.target.value = ''
        } catch (error) {
            console.error("Upload failed", error)
            alert("❌ Failed to upload CSV file.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="mb-6">
            <h4 className="text-xs font-semibold text-indigo-300/80 mb-3 uppercase tracking-wider">Batch Upload</h4>
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-500/30 border-dashed rounded-xl cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-400 transition-all duration-300 group bg-white/[0.02]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <svg className="animate-spin w-8 h-8 text-indigo-400 mb-2" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 text-indigo-400/50 group-hover:text-indigo-400 mb-2 transition-colors drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    )}
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.csv allowed</p>
                </div>
                <input type="file" className="hidden" accept=".csv" onChange={uploadFile} disabled={isUploading} />
            </label>
        </div>
    )
}