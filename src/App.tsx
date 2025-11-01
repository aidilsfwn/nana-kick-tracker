import { useState, useRef } from "react";
import { History, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, Button, Toaster, Skeleton } from "@/components/ui";
import { HistoryModal, Loading, LogButton } from "@/components";
import { useKicks } from "@/hooks";
import { calculateTimeInfo } from "@/utils";

export interface DailySummary {
  date: string;
  kickCount: number;
  timeTo10Kicks?: string | null;
}

const App = () => {
  const lastKickIdRef = useRef<string | null>(null);

  const { kicks, loading: appLoading, addKick, removeKick } = useKicks();

  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
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
    <div className="safe-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 flex items-center justify-center overflow-hidden">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Hi Farhana 👋
          </h1>
          <p className="text-gray-600 text-sm">Track your baby's kicks</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Calendar className="w-4 h-4 text-pink-600" />
              </div>
              <h2 className="font-semibold text-gray-700 text-sm">Due Date</h2>
              <p className="text-xl font-bold text-gray-900">
                December 25, 2024
              </p>
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <span className="text-2xl font-bold text-pink-600">
                  {daysToGo}
                </span>
                <span className="text-xs">days to go</span>
              </div>
              <p className="text-xs text-gray-500">
                {weeks} weeks, {days} days
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <LogButton onClick={handleLogKick} loading={loading} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded">
                  <Calendar className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Today</span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-12 rounded" />
              ) : (
                <p className="text-3xl font-bold text-purple-600">
                  {kicksToday}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">kicks</p>
            </CardContent>
          </Card>

          {/* Time to 10 Kicks */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded">
                  <Clock className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Time to 10
                </span>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-12 rounded" />
              ) : (
                <p className="text-3xl font-bold text-blue-600">
                  {getTimeTo10Kicks() || "-"}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {getTimeTo10Kicks() ? "today" : "not yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          onClick={() => setHistoryOpen(true)}
        >
          <History className="w-4 h-4" />
          View Full History
        </Button>

        <HistoryModal
          open={historyOpen}
          setOpen={setHistoryOpen}
          data={dailySummaries}
        />

        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default App;
