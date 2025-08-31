import { useMemo, useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import { ConfirmDialog } from "~/components/ui/dialog-confirm";

import type { ShowDonationItem } from "../types";

type Props = {
  item: ShowDonationItem;
  index: number;
  deletingId: string | null;
  onDelete: (id: string, title: string) => void;
};

export default function TableRowDonation({ item, index, deletingId, onDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDeleting = deletingId === String(item.id);

  const percent = useMemo(() => {
    if (!item.target_amount || item.target_amount <= 0) return 0;
    return Math.min((item.collected_amount / item.target_amount) * 100, 100);
  }, [item.collected_amount, item.target_amount]);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onDelete(String(item.id), item.title || "Untitled");
  };

  return (
    <>
      <tr className={`hover:bg-gray-50 ${isDeleting ? "opacity-60 pointer-events-none" : ""}`}>
        <td className="px-4 py-3 border-b">{index}</td>
        <td className="px-4 py-3 border-b font-medium text-gray-900">{item.title}</td>
        <td className="px-4 py-3 border-b">{item.location}</td>
        <td className="px-4 py-3 border-b">Rp {item.target_amount.toLocaleString("id-ID")}</td>
        <td className="px-4 py-3 border-b w-48">
          <div className="mb-1 font-medium text-gray-800">Rp {item.collected_amount.toLocaleString("id-ID")}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-green-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </td>
        <td className="px-4 py-3 border-b capitalize">
          <StatusBadge status={item.status ?? ""} />
        </td>
        <td className="px-4 py-3 border-b">{item.ends_at ? format(new Date(item.ends_at), "dd MMM yyyy") : "-"}</td>
        <td className="px-4 py-3 border-b text-center">
          <div className="flex justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://www.peduliilmu.org/id/donation/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  <Eye className="w-4 h-4" />
                  Detail
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom">Lihat Detail</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={`/donation/${item.id}/update`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-yellow-100 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Edit Program</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Hapus Program</TooltipContent>
            </Tooltip>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this item?"
        description="This action cannot be undone. The item will be permanently removed."
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        onConfirm={handleConfirm}
        disabled={isDeleting}
      />
    </>
  );
}
