/** Utility function to trim string for fit in server container*/
export const trim = (input: string, postfix: string = ''): string => {
  const nameLen = window.innerWidth < 640 ? 35 : window.innerWidth < 1280 ? 55 : window.innerWidth < 1536 ? 50 : window.innerWidth < 1920 ? 15 : 40;

  if (input.length <= nameLen) {
    return input;
  }

  const postfixLength = postfix ? postfix.length + 1 : 0;
  const truncatedLength = nameLen - postfixLength;

  return input.substring(0, truncatedLength) + '...' + (postfix ? postfix : '');
};
