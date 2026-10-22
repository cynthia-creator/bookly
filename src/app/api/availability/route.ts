import { getServiceById } from "@/lib/data";
import { DatabaseConfigurationError, getDatabase } from "@/lib/db";
import { getNextDays, getSlots, toISODate } from "@/lib/slots";
import { bookingDateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const parsedDate = bookingDateSchema.safeParse(searchParams.get("date"));
  const service = serviceId ? getServiceById(serviceId) : undefined;

  if (!service || !parsedDate.success) {
    return Response.json({ error: "Choose a valid service and date." }, { status: 400 });
  }

  const date = parsedDate.data;
  const today = toISODate(new Date());
  if (!getNextDays(today).includes(date)) {
    return Response.json({ error: "That date is outside the booking window." }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT
        service_id AS "serviceId",
        appointment_date::text AS date,
        to_char(start_time, 'HH24:MI') AS time,
        duration_minutes AS "durationMinutes"
      FROM bookings
      WHERE appointment_date = ${date}::date
    `;

    const bookings = rows.map((row) => ({
      serviceId: String(row.serviceId),
      date: String(row.date),
      time: String(row.time),
      durationMinutes: Number(row.durationMinutes),
    }));

    return Response.json({
      slots: getSlots(service, date, bookings, new Date()),
    });
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return Response.json({ error: "Booking availability is not configured yet." }, { status: 503 });
    }

    console.error("Failed to load booking availability.", error);
    return Response.json({ error: "Could not load availability. Please try again." }, { status: 500 });
  }
}
