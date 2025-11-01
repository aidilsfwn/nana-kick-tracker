import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  //  HistoryChart as Chart,
  HistoryTable as Table,
} from "@/components";
import type { DailySummary } from "@/App";

interface HistoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: DailySummary[];
}

export const HistoryModal = ({ open, setOpen, data }: HistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Full History</DialogTitle>
        </DialogHeader>
        {/* <div className="space-y-6"> */}
        {/* <Chart data={data} /> */}
        <Table data={data} />
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
};
