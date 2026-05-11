"use client"

import { useState } from "react"
import { createGig } from "@/lib/actions"
import { Logo } from "@/components/ui/logo"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewGigPage() {
  const [error, setError] = useState<Record<string, string[]> | string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await createGig(formData)

    if (result?.error) {
      if ("message" in result.error) {
        setError(result.error.message)
      } else {
        setError(result.error)
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <Link href="/gigs" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Gigs
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-2">Post a New Gig</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Describe what you need and set your budget.</p>

          {typeof error === "string" && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1" htmlFor="title">Gig Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Design a Landing Page for my SaaS"
              />
              {typeof error === "object" && error?.title && (
                <p className="text-red-500 text-xs mt-1 ml-1">{error.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Describe the task in detail..."
              ></textarea>
              {typeof error === "object" && error?.description && (
                <p className="text-red-500 text-xs mt-1 ml-1">{error.description[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1" htmlFor="budget">Budget ($)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="50"
              />
              {typeof error === "object" && error?.budget && (
                <p className="text-red-500 text-xs mt-1 ml-1">{error.budget[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all mt-4 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Gig"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
