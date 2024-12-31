import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {  // Use Promise, not PromiseRejectionEvent
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;  // Reject the promise if error occurs
    reader.readAsDataURL(file);
  });
}
