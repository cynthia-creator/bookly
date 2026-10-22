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

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-lg font-bold tracking-tight">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand to-[#ff6b8a] text-xs font-bold text-white">
        {n}
      </span>
      {children}
    </h2>
  );
}

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
    return <p className="mt-10 text-sm text-muted">Loading availability…</p>;
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
    <section className="mt-10 rounded-3xl border border-line bg-surface p-6 shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)] sm:p-8">
      <StepHeading n={1}>Pick a date</StepHeading>
      <div className="mt-5 flex gap-3 overflow-x-auto pb-3">
        {days.map((iso) => {
          const d = parseISODate(iso);
          const isSelected = iso === selectedDate;
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedDate(iso);
                setSelectedTime(null);
                setAvailabilityError(null);
              }}
              className={cn(
                "w-[68px] shrink-0 rounded-2xl border-[1.5px] px-1 py-3 text-center transition duration-200",
                isSelected
                  ? "border-transparent bg-gradient-to-br from-brand to-[#ff6b8a] text-white shadow-lg shadow-brand/30"
                  : "border-line hover:-translate-y-0.5 hover:border-brand"
              )}
            >
              <span
                className={cn(
                  "block text-[11px] font-semibold uppercase tracking-wider",
                  isSelected ? "text-white/80" : "text-muted"
                )}
              >
                {d.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span className="block text-xl font-extrabold">{d.getDate()}</span>
              <span
                className={cn("block text-xs", isSelected ? "text-white/80" : "text-muted")}
              >
                {d.toLocaleDateString("en-GB", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-8">
          <StepHeading n={2}>Pick a time</StepHeading>
          {isLoadingAvailability ? (
            <p className="mt-4 text-sm text-muted" role="status">
              Loading available times…
            </p>
          ) : availabilityError ? (
            <div
              className="mt-4 rounded-2xl border border-red-300/60 bg-red-500/10 p-4"
              role="alert"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{availabilityError}</p>
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-brand hover:underline"
                onClick={() => {
                  setAvailabilityError(null);
                  setAvailabilityRequest((request) => request + 1);
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {slots.map(({ time, available }) => (
                <button
                  key={time}
                  type="button"
                  disabled={!available}
                  aria-pressed={time === selectedTime}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "rounded-xl border-[1.5px] px-3 py-3 text-sm font-semibold transition",
                    !available &&
                      "cursor-not-allowed border-line text-muted line-through opacity-40",
                    available &&
                      time !== selectedTime &&
                      "border-line hover:border-brand hover:text-brand",
                    time === selectedTime &&
                      "border-brand bg-brand text-white shadow-md shadow-brand/30"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-ink">
          {selectedDate && selectedTime ? (
            <>
              <span className="font-bold">{service.name}</span> on {selectedDate} at{" "}
              {selectedTime}
            </>
          ) : (
            <span className="text-muted">Select a date and time to continue</span>
          )}
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