import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDate = (date: string) =>
  format(new Date(date), "d MMMM yyyy", { locale: ru });

export const formatDateShort = (date: string) =>
  format(new Date(date), "d MMM", { locale: ru });

export const formatDateTime = (date: string) =>
  format(new Date(date), "d MMMM yyyy, HH:mm", { locale: ru });

export const platformLabels: Record<string, string> = {
  yandex: "Яндекс Музыка",
  spotify: "Spotify",
  apple: "Apple Music",
  youtube: "YouTube",
};

export const platformColors: Record<string, string> = {
  yandex: "bg-[hsl(45,100%,50%)] text-[hsl(0,0%,4%)]",
  spotify: "bg-[hsl(141,73%,42%)] text-[hsl(0,0%,100%)]",
  apple: "bg-[hsl(350,80%,55%)] text-[hsl(0,0%,100%)]",
  youtube: "bg-[hsl(0,100%,50%)] text-[hsl(0,0%,100%)]",
};
