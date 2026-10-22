"use client";

import { useState, useSyncExternalStore } from "react";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  getMockBookings,
  getNextDays,
  getSlots,
  parseISODate,
  toISODate,
} from "@/lib/slots";

const subscribe = () => () => {};

export function BookingPicker({ service }: { service: Service }) {
  // Reads today's date in the browser only. Returns "" on the server,
  // which avoids hydration errors from server/browser time differences.
  const today = useSyncExternalStore(
    subscribe,
    () => toISODate(new Date()),
    () => ""
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!today) {
    return <p className="mt-10 text-sm text-gray-500">Loading availability…</p>;
  }

  const days = getNextDays(today);
  const slots = selectedDate
    ? getSlots(service, selectedDate, getMockBookings(today), new Date())
    : [];

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">1. Pick a date</h2>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {days.map((iso) => {
          const d = parseISODate(iso);
          const isSelected = iso === selectedDate;
          return (
            <button
              key={iso}
              onClick={() => {
                setSelectedDate(iso);
                setSelectedTime(null);
              }}
              className={cn(
                "w-16 shrink-0 rounded-lg border p-2 text-center transition-colors",
                isSelected
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "hover:border-indigo-400"
              )}
            >
              <span className="block text-xs uppercase">
                {d.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span className="block text-lg font-semibold">{d.getDate()}</span>
              <span className="block text-xs">
                {d.toLocaleDateString("en-GB", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <>
          <h2 className="mt-8 text-xl font-semibold">2. Pick a time</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map(({ time, available }) => (
              <button
                key={time}
                disabled={!available}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm transition-colors",
                  !available && "cursor-not-allowed bg-gray-100 text-gray-400 line-through",
                  available && time !== selectedTime && "hover:border-indigo-400",
                  time === selectedTime && "border-indigo-600 bg-indigo-600 text-white"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex items-center justify-between rounded-xl border p-4">
        <p className="text-sm text-gray-600">
          {selectedDate && selectedTime
            ? `${service.name} on ${selectedDate} at ${selectedTime}`
            : "Select a date and time to continue"}
        </p>
        <Button disabled={!selectedDate || !selectedTime}>Continue</Button>
      </div>
    </section>
  );
}