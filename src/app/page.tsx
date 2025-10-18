export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Job Quest</h1>
      <p className="text-lg text-gray-700 mb-8">
        Try a job before you choose a job. Pick a short quest, submit your work, and get graded by a mentor.
      </p>
      <div className="flex gap-3">
        <a href="/login" className="bg-gray-900 text-white px-5 py-2 rounded-lg">Sign in</a>
        <a href="/app" className="underline text-gray-700">Go to app</a>
      </div>
      <div className="mt-10 text-sm text-gray-500">
        MVP build • Next.js + Supabase • Deployed on Vercel
      </div>
    </main>
  );
}
