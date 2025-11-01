import { DUE_DATE, LMP } from "@/constants";

const calculateTimeInfo = () => {
  const now = new Date();
  const diffTime = DUE_DATE.getTime() - now.getTime();
  const daysToGo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const diffSinceLMP = now.getTime() - LMP.getTime();
  const daysPregnant = Math.floor(diffSinceLMP / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(daysPregnant / 7);
  const days = daysPregnant % 7;

  return { daysToGo, weeks, days };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export { calculateTimeInfo, formatDate };
