import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const formatPercent = (value: number): string =>
  `${value.toFixed(2)}%`;

export const formatNumber = (value: number): string =>
  value.toLocaleString('en-US');
