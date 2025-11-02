import { useState, useRef } from "react";
import { Calendar, Heart, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  Button,
  Toaster,
  Skeleton,
  Separator,
} from "@/components/ui";
import { HistoryTable, Loading } from "@/components";
import { useKicks } from "@/hooks";
import { calculateTimeInfo } from "@/utils";
import { DUE_DATE } from "@/constants";
import logo from "./assets/logo.svg";

export interface DailySummary {
  date: string;
  kickCount: number;
  timeTo10Kicks?: string | null;
}

const App = () => {
  const lastKickIdRef = useRef<string | null>(null);

  const { kicks, loading: appLoading, addKick, removeKick } = useKicks();

  const [loading, setLoading] = useState<boolean>(false);

  const { daysToGo, weeks, days } = calculateTimeInfo();

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const kicksToday = kicks.filter((k) => k.date === getTodayDate()).length;

  const getDailySummaries = (): DailySummary[] => {
    const dateMap = new Map<string, typeof kicks>();

    kicks.forEach((kick) => {
      if (!dateMap.has(kick.date)) {
        dateMap.set(kick.date, []);
      }
      dateMap.get(kick.date)!.push(kick);
    });

    return Array.from(dateMap.entries())
      .map(([date, dateKicks]) => {
        const kickCount = dateKicks.length;
        let timeTo10Kicks: string | null = null;

        if (kickCount >= 10) {
          const sortedKicks = [...dateKicks].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const firstKick = new Date(sortedKicks[0].timestamp);
          const tenthKick = new Date(sortedKicks[9].timestamp);

          const diffMs = tenthKick.getTime() - firstKick.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 60) {
            timeTo10Kicks = `${diffMins}m`;
          } else {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            timeTo10Kicks = `${hours}h ${mins}m`;
          }
        }

        return { date, kickCount, timeTo10Kicks };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const dailySummaries = getDailySummaries();

  const getTimeTo10Kicks = () => {
    const todayKicks = kicks.filter((k) => k.date === getTodayDate());
    if (todayKicks.length < 10) return null;

    const sortedKicks = todayKicks.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const firstKick = new Date(sortedKicks[0].timestamp);
    const tenthKick = new Date(sortedKicks[9].timestamp);

    const diffMs = tenthKick.getTime() - firstKick.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  const handleLogKick = async () => {
    setLoading(true);
    try {
      const kickId = await addKick();
      lastKickIdRef.current = kickId;
      toast.success("Kick logged successfully! 🎉", {
        action: {
          label: "Undo",
          onClick: handleUndo,
        },
      });
    } catch {
      toast.error("Failed to log kick. Please try again.");
    }
    setLoading(false);
  };

  const handleUndo = async () => {
    setLoading(true);
    if (!lastKickIdRef.current) {
      toast.error("No kick to undo");
      return;
    }

    try {
      await removeKick(lastKickIdRef.current);
      lastKickIdRef.current = null;
      toast.success("Kick removed");
    } catch {
      toast.error("Failed to remove kick");
    }
    setLoading(false);
  };

  if (appLoading) return <Loading />;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center overflow-hidden">
      <div className="w-full space-y-4">
        <div className="bg-white flex flex-col px-6 md:px-8 py-4 shadow-sm">
          <div className="flex flex-row gap-4 items-center">
            <img src={logo} alt="Loading" className="w-16 h-16" />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold">Nana's Kick Tracker</span>
              <div className="flex flex-row gap-2 items-center">
                <span className="italic text-sm text-neutral-400">
                  Built with love, by yours truly
                </span>
                <Heart fill="#ff78ae" className="text-[#ff78ae] w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-6 md:px-8 py-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold">Hi Farhana 👋</h1>
            <p className="text-gray-600 text-sm">Track your baby's kicks</p>
          </div>
          <Card className="shadow-md border-0">
            <CardContent>
              <div className="flex flex-col justify-center gap-2">
                <div className="font-semibold text-gray-700 text-sm">
                  Baby's Due Date:{" "}
                  {DUE_DATE.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  (<span className="text-pink-600">{daysToGo}</span> days to go)
                </div>
                <div className="font-semibold text-gray-700 text-sm">
                  Fetal Age: {weeks} weeks{days > 0 ? `, ${days} days` : ""}
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <Calendar className="w-3 h-3 text-purple-600" />
                  </div>
                  <div className="font-semibold">Today's Stats</div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col gap-2 text-center">
                    <div>Kicks </div>
                    {loading ? (
                      <Skeleton className="h-8 w-10 rounded self-center" />
                    ) : (
                      <div className="text-3xl font-bold text-purple-600">
                        {kicksToday}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 text-center">
                    <div>Time to 10</div>
                    {loading ? (
                      <Skeleton className="h-8 w-10 rounded self-center" />
                    ) : (
                      <div className="text-3xl font-bold text-blue-600">
                        {getTimeTo10Kicks() || "-"}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className="max-w-sm w-full self-center mt-2"
                  onClick={handleLogKick}
                  disabled={loading}
                  size="lg"
                >
                  <Plus />
                  Log Kick
                </Button>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col gap-3">
                <div className="font-semibold">History</div>
                <HistoryTable data={dailySummaries} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default App;
