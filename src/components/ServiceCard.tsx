import { Service } from "@/types";
import { Button } from "@/components/ui/Button";

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
        <Button>Book now</Button>
      </div>
    </li>
  );
}