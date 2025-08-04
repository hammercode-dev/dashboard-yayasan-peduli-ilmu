import { Card } from "~/components/ui/card";
import { TooltipProvider } from "~/components/ui/tooltip";
import Pagination from "~/components/ui/pagination";

import TableRowDonation from "./TableRowDonation";
import SkeletonTableDonation from "./SkeletonTableDonation";

import { FileSearch } from "lucide-react";

import type { ShowDonationItem } from "../types";
import { useNavigate, useSearchParams } from "react-router";
type Props = {
  data: ShowDonationItem[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function TableDonation({ data, isLoading, page, pageSize, totalPages }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);

    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page.toString());
    }

    navigate({ search: newParams.toString() });
  };

  return (
    <Card className="p-2">
      <TooltipProvider>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <TableHead />
            <tbody>
              {data.length === 0 ? (
                <EmptyState colSpan={8} />
              ) : isLoading ? (
                <SkeletonTableDonation length={data.length} />
              ) : (
                data.map((item, index) => (
                  <TableRowDonation key={item.id} item={item} index={(page - 1) * pageSize + index + 1} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </TooltipProvider>

      {/* <Pagination totalPages={totalPages} currentPage={page} /> */}

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
    </Card>
  );
}

function TableHead() {
  const headings = ["No", "Judul", "Lokasi", "Target", "Terkumpul", "Status", "Berakhir", "Aksi"];

  return (
    <thead className="bg-gray-50 text-left">
      <tr>
        {headings.map((heading, i) => (
          <th key={i} className="px-4 py-3 text-gray-700 font-semibold border-b">
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <FileSearch className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Tidak ada data ditemukan</p>
          <p className="text-sm text-gray-400 mt-1">Coba ubah filter pencarian atau tambah data baru.</p>
        </div>
      </td>
    </tr>
  );
}
