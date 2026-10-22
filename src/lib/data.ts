import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    description: "A clean, precise cut tailored to you.",
    durationMinutes: 30,
    price: 25,
    image: "/images/haircut.jpg",
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Shape and tidy your beard.",
    durationMinutes: 20,
    price: 15,
    image: "/images/beard.jpg",
  },
];
export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}