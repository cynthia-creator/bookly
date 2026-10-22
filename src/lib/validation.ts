import { z } from "zod";

export const bookingFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  notes: z.string().trim().max(300, "Notes can be up to 300 characters"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Please choose a valid date");

export const createBookingSchema = bookingFormSchema.extend({
  serviceId: z.string().min(1).max(100),
  date: bookingDateSchema,
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Please choose a valid time"),
});

export type CreateBookingValues = z.infer<typeof createBookingSchema>;

export const availabilityResponseSchema = z.object({
  slots: z.array(
    z.object({
      time: z.string(),
      available: z.boolean(),
    })
  ),
});

export const bookingResponseSchema = z.object({
  id: z.string().min(1),
  confirmationEmail: z.enum(["sent", "test", "failed"]),
});