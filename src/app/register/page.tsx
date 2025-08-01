'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/register', form)
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        callbackUrl: '/dashboard'
      })
    } catch (err) {
      setError('Gagal mendaftar. Email mungkin sudah digunakan.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <a
        href="/"
        className="inline-flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </a>
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Register
        </button>
      </form>
    </div>
  )
}
