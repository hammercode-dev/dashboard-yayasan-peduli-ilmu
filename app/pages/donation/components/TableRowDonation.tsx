import { Link } from "react-router";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";

import StatusBadge from "./StatusBadge";

import type { ShowDonationItem } from "../types";

type TableRowDonationProps = {
  item: ShowDonationItem;
  index: number;
};

export default function TableRowDonation({ item, index }: TableRowDonationProps) {
  const percent = Math.min((item.collected_amount / item.target_amount) * 100, 100);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 border-b">{index}</td>
      <td className="px-4 py-3 border-b font-medium text-gray-900">{item.title}</td>
      <td className="px-4 py-3 border-b">{item.location}</td>
      <td className="px-4 py-3 border-b">Rp {item.target_amount.toLocaleString("id-ID")}</td>
      <td className="px-4 py-3 border-b w-48">
        <div className="mb-1 font-medium text-gray-800">Rp {item.collected_amount.toLocaleString("id-ID")}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
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
                to={`/donation/edit/${item.id}`}
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
                onClick={() => alert(`Delete ID: ${item.id}`)}
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
  );
}
