import React from 'react'

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold tracking-tight">
          Hyderabad Truth Map
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Hussain Sagar lake encroachment — 2016 vs 2025 (Sentinel-2 NDWI)
        </p>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Map loading soon — scaffold in place.</p>
      </main>
    </div>
  )
}
