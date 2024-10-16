import { ExplorerLink } from "@/components/ExplorerLink";
import { toast } from "react-hot-toast";

export const showTransactionToast = (signature: string) => {
  toast.custom(
    (t) => (
      <div className="flex flex-col bg-background border border-white rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2 space-x-4">
          <span className="font-bold text-xs">Transaction Sent!</span>
          <button
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </div>
        <ExplorerLink
          path={`tx/${signature}`}
          label="View Transaction"
          className="btn btn-sm btn-primary mt-2"
        />
      </div>
    ),
    {
      duration: 10000,
      position: "bottom-right",
    }
  );
};
