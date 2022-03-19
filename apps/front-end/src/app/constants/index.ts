export const STRONG_PASSWORD_PATTERN =
  /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./;

export type LIST_OPERATORS = '+' | '-' | '%';
export type LIST_TYPES_PROPS = 'Income' | 'Expense' | 'Split';

export const LIST_TYPES: Record<LIST_TYPES_PROPS, LIST_OPERATORS> = {
  Income: '+',
  Expense: '-',
  Split: '%',
};
