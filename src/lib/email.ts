import { Resend } from "resend";

type BookingConfirmation = {
  to: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
};

export async function sendBookingConfirmation({
  to,
  customerName,
  serviceName,
  date,
  time,
  durationMinutes,
  price,
}: BookingConfirmation): Promise<"test" | "customer"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const testRecipient = process.env.RESEND_TEST_TO?.trim();

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured.");
  }

  if (from.toLowerCase().includes("@resend.dev") && !testRecipient) {
    throw new Error("RESEND_TEST_TO is required when using Resend's test sender.");
  }

  const isTest = Boolean(testRecipient);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [testRecipient || to],
    subject: `Booking confirmed: ${serviceName}`,
    text: [
      `Hi ${customerName},`,
      "",
      `Your ${serviceName} appointment is booked for ${date} at ${time}.`,
      `Duration: ${durationMinutes} minutes.`,
      `Price: $${price}.`,
      "",
      isTest
        ? "This is a test confirmation. The customer did not receive this email."
        : "We look forward to seeing you.",
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Resend could not send the confirmation: ${error.message}`);
  }

  return isTest ? "test" : "customer";
}