export const tooManyDecimals = (
  value: string,
  maxDecimals: number,
): boolean => {
  const parts = value.split(".");
  return parts.length === 2 && parts[1].length > maxDecimals;
};
