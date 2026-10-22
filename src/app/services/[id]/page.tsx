import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getServiceById } from "@/lib/data";
import { Button } from "@/components/ui/Button";

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
      <Link href="/services" className="text-sm text-indigo-600 hover:underline">
        ← Back to services
      </Link>

      <h1 className="mt-6 text-4xl font-bold tracking-tight">{service.name}</h1>
      <p className="mt-4 text-lg text-gray-600">{service.description}</p>

      <dl className="mt-8 grid grid-cols-2 gap-6 rounded-xl border p-6">
        <div>
          <dt className="text-sm text-gray-500">Price</dt>
          <dd className="mt-1 text-2xl font-semibold">${service.price}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Duration</dt>
          <dd className="mt-1 text-2xl font-semibold">{service.durationMinutes} min</dd>
        </div>
      </dl>

      <Button className="mt-8">Choose a time (coming next)</Button>
    </div>
  );
}