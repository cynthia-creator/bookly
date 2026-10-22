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