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
  "mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 aria-[invalid=true]:border-red-500";

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
      <section className="mt-10 rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-xl font-semibold text-green-800">Booking confirmed 🎉</h2>
        <p className="mt-2 text-sm text-green-900">
          Thanks, {confirmed.customerName}. Your {service.name} is booked for{" "}
          <strong>{prettyDate}</strong> at <strong>{time}</strong>.
        </p>
        <p className="mt-1 text-sm text-green-900">
          We’ll use {confirmed.customerEmail} for your appointment details.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">3. Your details</h2>

      <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
        <p className="font-medium">{service.name}</p>
        <p className="text-gray-600">
          {prettyDate} at {time} · {service.durationMinutes} min · ${service.price}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        {submitError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {submitError}
          </p>
        )}
        <div>
          <label htmlFor="customerName" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="customerName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.customerName}
            className={inputClass}
            {...register("customerName")}
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className="text-sm font-medium">
            Email
          </label>
          <input
            id="customerEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.customerEmail}
            className={inputClass}
            {...register("customerEmail")}
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-medium">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            aria-invalid={!!errors.notes}
            className={inputClass}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirming…" : "Confirm booking"}
          </Button>
        </div>
      </form>
    </section>
  );
}