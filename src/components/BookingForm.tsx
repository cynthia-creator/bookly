"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Service } from "@/types";
import { Button } from "@/components/ui/Button";
import { parseISODate } from "@/lib/slots";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validation";

interface BookingFormProps {
  service: Service;
  date: string;
  time: string;
  onBack: () => void;
}

const inputClass =
  "mt-2 w-full rounded-xl border-[1.5px] border-line bg-background px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20";

const labelClass = "text-sm font-semibold text-ink";
const errorClass = "mt-1.5 text-sm text-red-600 dark:text-red-400";

export function BookingForm({ service, date, time, onBack }: BookingFormProps) {
  const [confirmed, setConfirmed] = useState<BookingFormValues | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { customerName: "", customerEmail: "", notes: "" },
  });

  const prettyDate = parseISODate(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function onSubmit(values: BookingFormValues) {
    setSubmitError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          serviceId: service.id,
          date,
          time,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Could not create your booking. Please try again.";
        throw new Error(message);
      }

      setConfirmed(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not create your booking. Please try again."
      );
    }
  }

  if (confirmed) {
    return (
      <section className="mt-10 rounded-3xl border border-line bg-surface p-8 text-center shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-3xl text-white shadow-lg shadow-emerald-500/30">
          ✓
        </div>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight">
          You’re{" "}
          <em className="bg-gradient-to-br from-brand to-[#ff6b8a] bg-clip-text pr-1 font-serif font-normal text-transparent">
            booked!
          </em>
        </h2>
        <p className="mt-3 text-muted">
          Thanks, {confirmed.customerName}. Your {service.name} is booked for{" "}
          <strong className="text-ink">{prettyDate}</strong> at{" "}
          <strong className="text-ink">{time}</strong>.
        </p>
        <p className="mt-1 text-sm text-muted">
          We’ll use {confirmed.customerEmail} for your appointment details.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-3xl border border-line bg-surface p-6 shadow-[0_10px_40px_-12px_rgba(109,74,255,0.25)] sm:p-8">
      <h2 className="flex items-center gap-3 text-lg font-bold tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand to-[#ff6b8a] text-xs font-bold text-white">
          3
        </span>
        Your details
      </h2>

      <div className="mt-5 rounded-2xl bg-brand-soft p-5 text-sm">
        <p className="text-base font-bold">{service.name}</p>
        <p className="mt-1 text-muted">
          {prettyDate} at {time} · {service.durationMinutes} min · ${service.price}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        {submitError && (
          <p
            className="rounded-2xl border border-red-300/60 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {submitError}
          </p>
        )}
        <div>
          <label htmlFor="customerName" className={labelClass}>
            Full name
          </label>
          <input
            id="customerName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={!!errors.customerName}
            className={inputClass}
            {...register("customerName")}
          />
          {errors.customerName && (
            <p className={errorClass}>{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className={labelClass}>
            Email
          </label>
          <input
            id="customerEmail"
            type="email"
            autoComplete="email"
            placeholder="jane@email.com"
            aria-invalid={!!errors.customerEmail}
            className={inputClass}
            {...register("customerEmail")}
          />
          {errors.customerEmail && (
            <p className={errorClass}>{errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Anything we should know?"
            aria-invalid={!!errors.notes}
            className={inputClass}
            {...register("notes")}
          />
          {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
            {isSubmitting ? "Confirming…" : "Confirm booking"}
          </Button>
        </div>
      </form>
    </section>
  );
}