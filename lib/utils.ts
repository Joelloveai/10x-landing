import { clsx, type ClassValue } from "clsx";

/**
 * Joins class names. Deliberately no tailwind-merge (keeps ~12KB out of the client bundle):
 * callers must not pass classes that conflict with a component's base classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRM(value: number) {
  return `RM${Math.round(value).toLocaleString("en-MY")}`;
}
