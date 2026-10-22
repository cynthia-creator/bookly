"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BookingForm } from "@/components/BookingForm";
import {
  getNextDays,
  parseISODate,
  toISODate,
} from "@/lib/slots";
import { availabilityResponseSchema } from "@/lib/validation";

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
  const [step, setStep] = useState<"pick" | "details">("pick");
  const [availability, setAvailability] = useState<{
    date: string;
    slots: { time: string; available: boolean }[];
  } | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [availabilityRequest, setAvailabilityRequest] = useState(0);

  useEffect(() => {
    if (selectedDate === null) return;
    const requestedDate = selectedDate;

    const controller = new AbortController();
    const query = new URLSearchParams({ serviceId: service.id, date: requestedDate });

    async function loadAvailability() {
      try {
        const response = await fetch(`/api/availability?${query}`, {
          signal: controller.signal,
        });
        const result: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Could not load availability. Please try again.";
          throw new Error(message);
        }
        const parsed = availabilityResponseSchema.safeParse(result);
        if (!parsed.success) {
          throw new Error("The availability response was invalid.");
        }

        if (!controller.signal.aborted) {
          setAvailability({ date: requestedDate, slots: parsed.data.slots });
          setAvailabilityError(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setAvailabilityError(
            error instanceof Error
              ? error.message
              : "Could not load availability. Please try again."
          );
        }
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, [availabilityRequest, selectedDate, service.id]);

  if (!today) {
    return <p className="mt-10 text-sm text-gray-500">Loading availability…</p>;
  }

  if (step === "details" && selectedDate && selectedTime) {
    return (
      <BookingForm
        service={service}
        date={selectedDate}
        time={selectedTime}
        onBack={() => setStep("pick")}
      />
    );
  }

  const days = getNextDays(today);
  const slots =
    selectedDate && availability?.date === selectedDate ? availability.slots : [];
  const isLoadingAvailability =
    selectedDate !== null && availability?.date !== selectedDate && !availabilityError;

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
              type="button"
              onClick={() => {
                setSelectedDate(iso);
                setSelectedTime(null);
                setAvailabilityError(null);
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
          {isLoadingAvailability ? (
            <p className="mt-4 text-sm text-gray-500" role="status">
              Loading available times…
            </p>
          ) : availabilityError ? (
            <div className="mt-4" role="alert">
              <p className="text-sm text-red-600">{availabilityError}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-indigo-600 hover:underline"
                onClick={() => {
                  setAvailabilityError(null);
                  setAvailabilityRequest((request) => request + 1);
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map(({ time, available }) => (
                <button
                  key={time}
                  type="button"
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
          )}
        </>
      )}

      <div className="mt-8 flex items-center justify-between rounded-xl border p-4">
        <p className="text-sm text-gray-600">
          {selectedDate && selectedTime
            ? `${service.name} on ${selectedDate} at ${selectedTime}`
            : "Select a date and time to continue"}
        </p>
        <Button
          disabled={!selectedDate || !selectedTime || isLoadingAvailability || !!availabilityError}
          onClick={() => setStep("details")}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}