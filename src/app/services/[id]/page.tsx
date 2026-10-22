import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getServiceById } from "@/lib/data";
import { BookingPicker } from "@/components/BookingPicker";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);
  return { title: service ? `${service.name} | Bookly` : "Service not found" };
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:border-brand hover:text-brand"
      >
        ← Back to services
      </Link>

      <h1 className="mt-8 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        {service.name}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        {service.description}
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)]">
        <div className="bg-surface p-6">
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
            Price
          </dt>
          <dd className="mt-2 bg-gradient-to-br from-brand to-[#ff6b8a] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            ${service.price}
          </dd>
        </div>
        <div className="bg-surface p-6">
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
            Duration
          </dt>
          <dd className="mt-2 text-3xl font-extrabold tracking-tight">
            {service.durationMinutes}{" "}
            <span className="text-base font-semibold text-muted">min</span>
          </dd>
        </div>
      </dl>

      <BookingPicker service={service} />
    </div>
  );
}