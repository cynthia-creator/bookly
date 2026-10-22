export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  image: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  date: string; // ISO format: "2026-11-05"
  time: string; // "14:00"
}