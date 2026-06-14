// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\lib\utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
