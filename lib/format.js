export const money = (n) => 'R' + (Number.isInteger(Number(n)) ? Number(n) : Number(n).toFixed(2));
