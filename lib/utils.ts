import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * وظيفة آمنة للاستخدام مع Object.entries
 */
export function safeObjectEntries(obj: any) {
  if (!obj || typeof obj !== 'object') {
    console.warn('WARNING: Attempting to use Object.entries on non-object:', obj);
    return [];
  }
  return Object.entries(obj);
}

/**
 * وظيفة آمنة للاستخدام مع Array.reduce
 */
export function safeReduce<T, U>(arr: any, callback: (acc: U, val: T, index: number, array: T[]) => U, initialValue: U): U {
  if (!Array.isArray(arr)) {
    console.warn('WARNING: Attempting to use Array.reduce on non-array:', arr);
    return initialValue;
  }
  return arr.reduce(callback, initialValue);
}

/**
 * وظيفة لتنسيق التواريخ بشكل آمن
 */
export function formatDate(date: Date | string | null | undefined) {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  return String(date);
}

/**
 * وظيفة للتتبع والتشخيص
 * @param context - سياق التشخيص
 * @param data - البيانات المراد تتبعها
 */
export function debug(context: string, data: any) {
  console.log(`[DEBUG ${context}]:`, 
    typeof data === 'object' && data !== null 
      ? JSON.stringify(data, (key, value) => 
          value instanceof Date ? value.toISOString() : value, 2)
      : data
  );
}