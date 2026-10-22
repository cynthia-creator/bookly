import type { Booking, Service } from "@/types";
import { getServiceById } from "@/lib/data";

const OPENING_MINUTES = 9 * 60; // 09:00
const CLOSING_MINUTES = 17 * 60; // 17:00
const SLOT_STEP = 30; // a new slot every 30 minutes
const BOOKING_UTC_OFFSET_MINUTES = 120;

const pad = (n: number) => String(n).padStart(2, "0");

function formatCalendarDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toISODate(date: Date): string {
  const bookingDate = new Date(date.getTime() + BOOKING_UTC_OFFSET_MINUTES * 60_000);
  return `${bookingDate.getUTCFullYear()}-${pad(bookingDate.getUTCMonth() + 1)}-${pad(
    bookingDate.getUTCDate()
  )}`;
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
    if (day.getDay() !== 0) days.push(formatCalendarDate(day));
  }
  return days;
}

export interface Slot {
  time: string;
  available: boolean;
}

type BookingOccupancy = Pick<Booking, "serviceId" | "date" | "time"> & {
  durationMinutes?: number;
};

export function getSlots(
  service: Service,
  dateISO: string,
  bookings: BookingOccupancy[],
  now: Date
): Slot[] {
  const isToday = dateISO === toISODate(now);
  const bookingNow = new Date(now.getTime() + BOOKING_UTC_OFFSET_MINUTES * 60_000);
  const nowMinutes = bookingNow.getUTCHours() * 60 + bookingNow.getUTCMinutes();

  // Turn existing bookings for that day into time ranges
  const taken = bookings
    .filter((b) => b.date === dateISO)
    .map((b) => {
      const start = toMinutes(b.time);
      const duration =
        b.durationMinutes ?? getServiceById(b.serviceId)?.durationMinutes ?? SLOT_STEP;
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