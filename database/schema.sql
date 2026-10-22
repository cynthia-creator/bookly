CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  service_name text NOT NULL,
  customer_name varchar(80) NOT NULL,
  customer_email text NOT NULL,
  notes varchar(300) NOT NULL DEFAULT '',
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes BETWEEN 1 AND 480),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  appointment_range tsrange GENERATED ALWAYS AS (
    tsrange(
      appointment_date + start_time,
      appointment_date + start_time + make_interval(mins => duration_minutes),
      '[)'
    )
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_no_overlap EXCLUDE USING gist (appointment_range WITH &&),
  CONSTRAINT bookings_not_sunday CHECK (extract(dow FROM appointment_date) <> 0),
  CONSTRAINT bookings_opening_time CHECK (start_time >= time '09:00'),
  CONSTRAINT bookings_closing_time CHECK (
    start_time + make_interval(mins => duration_minutes) <= time '17:00'
  )
);

CREATE INDEX IF NOT EXISTS bookings_appointment_date_idx
  ON bookings (appointment_date);
