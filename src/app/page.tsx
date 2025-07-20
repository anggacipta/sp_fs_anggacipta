import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <header className="w-full max-w-2xl mx-auto flex flex-col items-center py-12">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          className="mb-6 invert"
          priority
        />
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Selamat Datang di MyTask</h1>
        <p className="text-gray-300 text-lg mb-4 text-center max-w-xl">Aplikasi manajemen project minimalis dengan nuansa hitam putih. Mulai kelola project dan tugasmu dengan mudah!</p>
        <div className="flex gap-4 mt-4">
          <a
            href="/login"
            className="px-6 py-2 bg-white text-black rounded shadow font-semibold hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-2 bg-white text-black rounded shadow font-semibold hover:bg-gray-200 transition"
          >
            Register
          </a>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center">
        <section className="bg-transparent border border-white rounded-lg shadow p-8 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Fitur Utama</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-200">
        <li>Manajemen project dan tugas dengan mudah</li>
        <li>Dashboard personal yang rapi</li>
        <li>Desain minimalis hitam putih</li>
        <li>Login aman dengan NextAuth</li>
          </ul>
        </section>
      </main>

      <footer className="w-full max-w-2xl mx-auto py-8 flex flex-col items-center border-t border-gray-800 mt-12">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} MyTask. Dibuat dengan Next.js.</p>
        <div className="flex gap-6 mt-2">
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Next.js</a>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Vercel</a>
        </div>
      </footer>
    </div>
  );
}
