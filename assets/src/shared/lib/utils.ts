import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const default_name_len =
  window.innerWidth < 640
    ? 35
    : window.innerWidth < 1280
      ? 55
      : window.innerWidth < 1536
        ? 50
        : window.innerWidth < 1920
          ? 15
          : 40;

export function useNameLen(input: string, postfix: string = ''): string {
  if (input.length <= default_name_len) {
    return input;
  }

  const postfixLength = postfix ? postfix.length + 1 : 0;
  const truncatedLength = default_name_len - postfixLength;

  return input.substring(0, truncatedLength) + '...' + (postfix ? postfix : '');
}
