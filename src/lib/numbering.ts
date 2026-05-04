const getNumericSuffix = (code: string, prefix: string) => {
  const match = code.match(new RegExp(`^${prefix}-(\\d+)$`));
  return match ? Number(match[1]) : 0;
};

export const getNextSystemCode = (
  codes: string[],
  prefix: string,
  padLength = 3
) => {
  const lastNumber = codes.reduce(
    (max, code) => Math.max(max, getNumericSuffix(code, prefix)),
    0
  );

  return `${prefix}-${String(lastNumber + 1).padStart(padLength, "0")}`;
};

export const getNextTransactionNumber = (
  numbers: string[],
  prefix: string,
  date = new Date(),
  padLength = 3
) => {
  const year = date.getFullYear();
  const fullPrefix = `${prefix}-${year}`;
  const lastNumber = numbers.reduce((max, number) => {
    const match = number.match(new RegExp(`^${fullPrefix}-(\\d+)$`));
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);

  return `${fullPrefix}-${String(lastNumber + 1).padStart(padLength, "0")}`;
};
