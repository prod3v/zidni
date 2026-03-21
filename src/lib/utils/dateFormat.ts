import { format } from "date-fns";
import { arSA as ar } from "date-fns/locale/ar-SA";

const dateFormat = (
  date: Date | string,
  pattern: string = "dd MMMM yyyy",
): string => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern, { locale: ar });
  return output;
};

export default dateFormat;
