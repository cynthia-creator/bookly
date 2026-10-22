import { getServiceById } from "@/lib/data";
import { DatabaseConfigurationError, getDatabase } from "@/lib/db";
import { sendBookingConfirmation } from "@/lib/email";
import { getNextDays, getSlots, toISODate } from "@/lib/slots";
import { createBookingSchema } from "@/lib/validation";

function isOverlapViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23P01"
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Check your booking details." }, { status: 400 });
  }

  const { serviceId, date, time, customerName, customerEmail, notes } = parsed.data;
  const service = getServiceById(serviceId);
  if (!service) {
    return Response.json({ error: "That service is not available." }, { status: 400 });
  }

  const today = toISODate(new Date());
  if (!getNextDays(today).includes(date)) {
    return Response.json({ error: "That date is outside the booking window." }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const existingRows = await sql`
      SELECT
        service_id AS "serviceId",
        appointment_date::text AS date,
        to_char(start_time, 'HH24:MI') AS time,
        duration_minutes AS "durationMinutes"
      FROM bookings
      WHERE appointment_date = ${date}::date
    `;
    const existingBookings = existingRows.map((row) => ({
      serviceId: String(row.serviceId),
      date: String(row.date),
      time: String(row.time),
      durationMinutes: Number(row.durationMinutes),
    }));
    const isAvailable = getSlots(service, date, existingBookings, new Date()).some(
      (slot) => slot.time === time && slot.available
    );

    if (!isAvailable) {
      return Response.json({ error: "That time is no longer available. Please choose another slot." }, { status: 409 });
    }

    const [booking] = await sql`
      INSERT INTO bookings (
        service_id,
        service_name,
        customer_name,
        customer_email,
        notes,
        appointment_date,
        start_time,
        duration_minutes,
        price
      )
      VALUES (
        ${service.id},
        ${service.name},
        ${customerName},
        ${customerEmail.toLowerCase()},
        ${notes},
        ${date}::date,
        ${time}::time,
        ${service.durationMinutes},
        ${service.price}
      )
      RETURNING id::text AS id
    `;

    // The booking is already saved, so an email problem must never fail it.
    try {
      await sendBookingConfirmation({
        to: customerEmail,
        customerName,
        serviceName: service.name,
        date,
        time,
        durationMinutes: service.durationMinutes,
        price: service.price,
      });
    } catch (emailError) {
      console.error("Could not send confirmation email.", emailError);
    }

    return Response.json({ id: booking.id }, { status: 201 });
  } catch (error) {
    if (isOverlapViolation(error)) {
      return Response.json({ error: "That time was just booked. Please choose another slot." }, { status: 409 });
    }
    if (error instanceof DatabaseConfigurationError) {
      return Response.json({ error: "Booking is not configured yet." }, { status: 503 });
    }

    console.error("Failed to create booking.", error);
    return Response.json({ error: "Could not create your booking. Please try again." }, { status: 500 });
  }
}