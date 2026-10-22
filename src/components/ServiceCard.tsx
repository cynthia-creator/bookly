import Link from "next/link";
import { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <li className="flex flex-col justify-between rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <h3 className="text-xl font-semibold">{service.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{service.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="font-medium">
          ${service.price} · {service.durationMinutes} min
        </p>
        <Link
          href={`/services/${service.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          View details
        </Link>
      </div>
    </li>
  );
}