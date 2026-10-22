import { services } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Bookly</h1>
      <p className="mt-2 text-gray-600">Book your next appointment in seconds.</p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.id} className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{s.description}</p>
            <p className="mt-4 font-medium">
              ${s.price} · {s.durationMinutes} min
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}