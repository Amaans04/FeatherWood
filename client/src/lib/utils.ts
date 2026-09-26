import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { scrollToTop, scrollToElement } from "@/lib/scroll";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleScrollToTop = () => {
  scrollToTop();
};

export const handleScrollToSection = (id: string) => {
  scrollToElement(id, -80);
};

export const isEmailValid = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
