import type { Region } from "@/generated/prisma/enums";

export const REGION_LABELS: Record<Region, string> = {
  MARAS: "Kahramanmaraş",
  HATAY: "Hatay",
  ADIYAMAN: "Adıyaman",
};

export const REGION_ORDER: Region[] = ["MARAS", "HATAY", "ADIYAMAN"];
