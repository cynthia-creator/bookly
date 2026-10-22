import Link from "next/link";
import { services } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

const highlights = [
  { icon: "⚡", title: "Book in seconds", text: "Pick a service, choose a time, and you’re done." },
  { icon: "🕒", title: "Live availability", text: "See open times in real time. No double bookings." },
  { icon: "📅", title: "Open Mon–Sat", text: "Appointments from 09:00 to 17:00, closed Sundays." },
];

export default function HomePage() {
  const featured = services.slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-20 text-center sm:py-28">
        <p className="mx-auto inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-muted">
          Online booking, made simple
        </p>
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
          Book your visit,
          <br />
          <em className="bg-gradient-to-br from-brand to-[#ff6b8a] bg-clip-text pr-1 font-serif font-normal text-transparent">
            effortlessly.
          </em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Choose a service, pick a time that suits you, and get your appointment
          confirmed in under a minute.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/services"
            className="rounded-full bg-gradient-to-br from-brand to-[#ff6b8a] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Book an appointment
          </Link>
          <Link
            href="/services"
            className="rounded-full border-[1.5px] border-line bg-surface px-8 py-3.5 text-base font-semibold transition hover:border-brand hover:text-brand"
          >
            View services
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => (
          <div
            key={h.title}
            className="rounded-3xl border border-line bg-surface p-6 shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-xl">
              {h.icon}
            </span>
            <h3 className="mt-4 text-lg font-bold tracking-tight">{h.title}</h3>
            <p className="mt-1 text-sm text-muted">{h.text}</p>
          </div>
        ))}
      </section>

      {/* Featured services */}
      <section className="mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Popular{" "}
            <em className="bg-gradient-to-br from-brand to-[#ff6b8a] bg-clip-text pr-1 font-serif font-normal text-transparent">
              services
            </em>
          </h2>
          <Link
            href="/services"
            className="shrink-0 text-sm font-semibold text-brand hover:underline"
          >
            See all →
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>
      </section>
    </div>
  );
}