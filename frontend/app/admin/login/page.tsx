"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BACKEND}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login failed.")
        return
      }

      // Store token in localStorage for API calls
      localStorage.setItem("admin_token", data.token)

      // Store in cookie so Next.js middleware can read it (session-duration)
      document.cookie = `admin_token=${data.token}; path=/; SameSite=Strict`

      router.push("/admin/dashboard")
    } catch {
      setError("Could not reach the server. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm p-8">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#bb1919]">
            Capital Headlines
          </p>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Restricted access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#bb1919] hover:bg-[#9a1414] text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
