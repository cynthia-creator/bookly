import type { Booking, Service } from "@/types";
import { getServiceById } from "@/lib/data";

const OPENING_MINUTES = 9 * 60; // 09:00
const CLOSING_MINUTES = 17 * 60; // 17:00
const SLOT_STEP = 30; // a new slot every 30 minutes

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

// The next 14 days, skipping Sundays (we're closed)
export function getNextDays(todayISO: string, count = 14): string[] {
  const start = parseISODate(todayISO);
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (day.getDay() !== 0) days.push(toISODate(day));
  }
  return days;
}

export interface Slot {
  time: string;
  available: boolean;
}

export function getSlots(
  service: Service,
  dateISO: string,
  bookings: Booking[],
  now: Date
): Slot[] {
  const isToday = dateISO === toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Turn existing bookings for that day into time ranges
  const taken = bookings
    .filter((b) => b.date === dateISO)
    .map((b) => {
      const start = toMinutes(b.time);
      const duration = getServiceById(b.serviceId)?.durationMinutes ?? SLOT_STEP;
      return { start, end: start + duration };
    });

  const slots: Slot[] = [];
  for (
    let start = OPENING_MINUTES;
    start + service.durationMinutes <= CLOSING_MINUTES;
    start += SLOT_STEP
  ) {
    const end = start + service.durationMinutes;
    const inThePast = isToday && start <= nowMinutes;
    const overlaps = taken.some((t) => start < t.end && t.start < end);
    slots.push({ time: toTime(start), available: !inThePast && !overlaps });
  }
  return slots;
}

// Temporary fake bookings so you can see blocked slots.
// In Step 7 this gets replaced by a real database.
export function getMockBookings(todayISO: string): Booking[] {
  const inDays = (n: number) => {
    const d = parseISODate(todayISO);
    d.setDate(d.getDate() + n);
    return toISODate(d);
  };

  return [
    { id: "b1", serviceId: "classic-haircut", customerName: "Sam", customerEmail: "sam@example.com", date: inDays(1), time: "10:00" },
    { id: "b2", serviceId: "beard-trim", customerName: "Lee", customerEmail: "lee@example.com", date: inDays(1), time: "11:30" },
    { id: "b3", serviceId: "classic-haircut", customerName: "Ayesha", customerEmail: "ayesha@example.com", date: inDays(2), time: "09:00" },
  ];
}