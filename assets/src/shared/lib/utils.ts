import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimForProcessBlock(input: string, postfix: string = ''): string {
  const DEFAULT_NAME_LEN =
    window.innerWidth < 640
      ? 35
      : window.innerWidth < 1280
        ? 55
        : window.innerWidth < 1536
          ? 50
          : window.innerWidth < 1920
            ? 15
            : 40;

  if (input.length <= DEFAULT_NAME_LEN) {
    return input;
  }

  const postfixLength = postfix ? postfix.length + 1 : 0;
  const truncatedLength = DEFAULT_NAME_LEN - postfixLength;

  return input.substring(0, truncatedLength) + '...' + (postfix ? postfix : '');
}
