'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100 transition"
    >
      Logout
    </button>
  )
}
