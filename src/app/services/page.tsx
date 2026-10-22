import type { Metadata } from "next";
import { services } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services | Bookly",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        What we offer
      </p>
      <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
        Our{" "}
        <em className="bg-gradient-to-br from-brand to-[#ff6b8a] bg-clip-text pr-1 font-serif font-normal text-transparent">
          services
        </em>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Pick a service to see details and book.
      </p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ul>
    </div>
  );
}