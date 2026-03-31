export const MIN_TERM_DAYS = 365;
export const MAX_TERM_DAYS = 5 * 365;
export const BOUNCE_FEE = 10000;

export const today = new Date();
today.setHours(0, 0, 0, 0);

export const minDate = new Date(today);
minDate.setDate(minDate.getDate() + MIN_TERM_DAYS);

export const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + MAX_TERM_DAYS);
