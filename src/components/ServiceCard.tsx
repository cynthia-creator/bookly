import Link from "next/link";
import { Service } from "@/types";

const keywordIcons: [string, string][] = [
  ["hair", "💇"],
  ["cut", "✂️"],
  ["massage", "💆"],
  ["nail", "💅"],
  ["facial", "🧖"],
  ["consult", "💬"],
  ["therapy", "🌿"],
  ["training", "💪"],
  ["dental", "🦷"],
];
const fallbackIcons = ["✨", "🌟", "📅", "💜", "🎯"];

function getIcon(service: Service, index: number) {
  const name = service.name.toLowerCase();
  const match = keywordIcons.find(([word]) => name.includes(word));
  return match ? match[1] : fallbackIcons[index % fallbackIcons.length];
}

export function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  return (
    <li className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-7 shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)] transition duration-200 hover:-translate-y-1 hover:border-brand">
      <div>
        <div className="flex items-start justify-between">
          <span
            aria-hidden
            className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-soft to-brand-soft text-2xl ring-1 ring-line transition group-hover:scale-105"
          >
            {getIcon(service, index)}
          </span>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {service.durationMinutes} min
          </span>
        </div>
        <h3 className="mt-5 text-xl font-bold tracking-tight">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {service.description}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-xl font-extrabold tracking-tight">${service.price}</p>
        <Link
          href={`/services/${service.id}`}
          className="rounded-full bg-gradient-to-br from-brand to-[#ff6b8a] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          View details →
        </Link>
      </div>
    </li>
  );
}