import Link from "next/link";

export default function Landing() {
  return (
    <main className="py-16 text-center">
      <h1 className="text-5xl font-bold mb-4">Try a job before you choose a job.</h1>
      <p className="text-lg text-gray-600 mb-8">Interactive quests that simulate real work.</p>
      <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl">
        Log in / Sign up
      </Link>
    </main>
  );
}
