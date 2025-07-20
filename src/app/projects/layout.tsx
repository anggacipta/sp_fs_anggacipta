import Link from "next/link"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r p-6">
        <h2 className="text-lg font-bold mb-6 text-white">MyTask</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:underline text-white">
            🏠 Dashboard
          </Link>
            <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="block w-full text-left hover:underline text-white bg-transparent border-none p-0"
            >
              🚪 Logout
            </button>
            </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
