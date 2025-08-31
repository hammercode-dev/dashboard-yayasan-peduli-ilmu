import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams, useFetcher } from "react-router";

import { Card } from "~/components/ui/card";
import Pagination from "~/components/ui/pagination";
import { TooltipProvider } from "~/components/ui/tooltip";
import { StatusDialog } from "~/components/ui/dialog-status";

import TableRowDonation from "./TableRowDonation";
import SkeletonTableDonation from "./SkeletonTableDonation";
import { FileSearch } from "lucide-react";
import type { ShowDonationItem } from "../types";

type Props = {
  data: ShowDonationItem[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
};

type StatusType = "loading" | "success" | "error";

export default function TableDonation({ data, isLoading, page, pageSize, totalPages }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const deleteFetcher = useFetcher<{ ok?: boolean; error?: string }>();

  // Which row is being deleted (for dimming/disable)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState<string>("");

  // Dialog state lives here
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>("loading");
  const [statusMsg, setStatusMsg] = useState<ReactNode>("");

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) newParams.delete("page");
    else newParams.set("page", String(newPage));
    navigate({ search: newParams.toString() });
  };

  const onDelete = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title || "Untitled");

    setStatusType("loading");
    setStatusMsg(`Deleting “${title || "Untitled"}”…`);
    setStatusOpen(true);

    // Submit from the PARENT so we can observe the result reliably
    deleteFetcher.submit(
      { _action: "delete", id },
      // IMPORTANT: use your real action path
      { method: "post", action: "/donation/:id/delete" }
    );
  };

  // Observe the parent fetcher to flip dialog state (row may have unmounted already)
  useEffect(() => {
    if (deleteFetcher.state !== "idle" || !deleteFetcher.data) return;

    if (deleteFetcher.data.ok) {
      setStatusType("success");
      setStatusMsg(
        <>
          You successfully deleted <span className="font-medium">{deletingTitle}</span>.
        </>
      );
      setDeletingId(null);

      return;
    } else {
      setStatusType("error");
      setStatusMsg(
        <>
          We couldn’t delete <span className="font-medium">{deletingTitle}</span>.
          <br />
          <span className="text-xs text-gray-500">Reason: {deleteFetcher.data.error || "Unknown error"}</span>
        </>
      );
      setDeletingId(null);
    }
  }, [deleteFetcher.state, deleteFetcher.data, deletingTitle]);

  const handleStatusOpenChange = (open: boolean) => {
    setStatusOpen(open);
    if (!open) {
      setStatusType("loading");
      setStatusMsg("");
    }
  };

  // page underflow: if current page becomes empty after revalidation, go back one page
  useEffect(() => {
    if (!isLoading && data.length === 0 && page > 1) {
      handlePageChange(page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data.length, page]);

  const bodyContent = useMemo(() => {
    if (data.length === 0) return <EmptyState colSpan={8} />;
    if (isLoading) return <SkeletonTableDonation length={data.length} />;
    return (
      <>
        {data.map((item, index) => (
          <TableRowDonation
            key={item.id}
            item={item}
            index={(page - 1) * pageSize + index + 1}
            deletingId={deletingId}
            onDelete={onDelete}
          />
        ))}
      </>
    );
  }, [data, isLoading, page, pageSize, deletingId]);

  return (
    <Card className="p-2">
      <TooltipProvider>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <TableHead />
            <tbody>{bodyContent}</tbody>
          </table>
        </div>
      </TooltipProvider>

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />

      <StatusDialog
        open={statusOpen}
        onOpenChange={handleStatusOpenChange}
        type={statusType}
        title={statusType === "loading" ? "Deleting…" : statusType === "success" ? "Deleted" : "Delete failed"}
        description={statusMsg}
        primaryAction={
          statusType !== "loading" ? { label: "OK", onClick: () => handleStatusOpenChange(false) } : undefined
        }
        showCloseButton={statusType !== "loading"}
      />
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
