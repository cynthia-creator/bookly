import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-gray-600">We couldn't find that page.</p>
      <Link href="/" className="mt-6 inline-block text-indigo-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}