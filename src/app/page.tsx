import { services } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Book your next appointment in seconds
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Choose a service, pick a time that suits you, and you're done.
        </p>
      </section>

      <section id="services" className="mt-20 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Our services</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>
      </section>
    </div>
  );
}