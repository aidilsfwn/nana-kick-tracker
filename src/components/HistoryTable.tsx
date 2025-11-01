import type { DailySummary } from "@/App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { formatDate } from "@/utils";

export const HistoryTable = ({ data }: { data: DailySummary[] }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-purple-50">
          <TableRow>
            <TableHead className="font-semibold text-purple-900">
              Date
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Kicks
            </TableHead>
            <TableHead className="font-semibold text-purple-900">
              Time to 10
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-4 py-8 text-center text-gray-500"
              >
                No kicks logged yet
              </TableCell>
            </TableRow>
          ) : (
            data
              .slice()
              .reverse()
              .map((summary) => (
                <TableRow key={summary.date}>
                  <TableCell>{formatDate(summary.date)}</TableCell>
                  <TableCell>{summary.kickCount}</TableCell>
                  <TableCell>{summary.timeTo10Kicks || "-"}</TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
