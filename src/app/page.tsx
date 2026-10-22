import type { Metadata } from "next";
import { services } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services | Bookly",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Our services</h1>
      <p className="mt-2 text-gray-600">Pick a service to see details and book.</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ul>
    </div>
  );
}