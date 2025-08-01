import { format } from "date-fns";
import { Link, useSearchParams, Await } from "react-router";
import Filters from "~/pages/donation/components/Filters";
import { Card } from "~/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import type { DonationLoaderData } from "~/routes/donation";
import { FileSearch, Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "~/components/ui/badge";
import React from "react";
import DonationSkeleton from "./components/DonationSkeleton";

type ListDonationProps = {
  list: DonationLoaderData;
};

function ListDonation({ list }: ListDonationProps) {
  const { data, total, page, pageSize, search, status, sort } = list;

  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Program Donasi</h1>
        <Link
          to="/donation/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow text-sm"
        >
          + Tambah Program
        </Link>
      </div>

      {/* Filters */}
      <Filters search={search} status={status} sort={sort} handleChange={handleChange} />

      <Card className="p-2">
        <TooltipProvider>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  {["No", "Judul", "Lokasi", "Target", "Terkumpul", "Status", "Berakhir", "Aksi"].map((heading, i) => (
                    <th key={i} className="px-4 py-3 text-gray-700 font-semibold border-b">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <React.Suspense fallback={<DonationSkeleton />}>
                  <Await
                    resolve={data}
                    errorElement={
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileSearch className="w-12 h-12 mb-4" />
                            <p className="text-lg font-medium">Gagal memuat data</p>
                            <p className="text-sm text-gray-400 mt-1">Silakan coba lagi atau periksa koneksi Anda.</p>
                          </div>
                        </td>
                      </tr>
                    }
                  >
                    {(resolvedData) =>
                      resolvedData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FileSearch className="w-12 h-12 mb-4" />
                              <p className="text-lg font-medium">Tidak ada data ditemukan</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Coba ubah filter pencarian atau tambah data baru.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        resolvedData.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 border-b">{(page - 1) * pageSize + index + 1}</td>
                            <td className="px-4 py-3 border-b font-medium text-gray-900">{item.title}</td>
                            <td className="px-4 py-3 border-b">{item.location}</td>
                            <td className="px-4 py-3 border-b">Rp {item.target_amount.toLocaleString("id-ID")}</td>
                            <td className="px-4 py-3 border-b w-48">
                              <div className="mb-1 font-medium text-gray-800">
                                Rp {item.collected_amount.toLocaleString("id-ID")}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min((item.collected_amount / item.target_amount) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-b capitalize">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="px-4 py-3 border-b">
                              {item.ends_at ? format(new Date(item.ends_at), "dd MMM yyyy") : "-"}
                            </td>
                            <td className="px-4 py-3 border-b text-center">
                              <div className="flex justify-center gap-2">
                                {/* Detail Button */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/donation/${item.slug}`}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                    >
                                      <Eye className="w-4 h-4" />
                                      Detail
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">Lihat Detail</TooltipContent>
                                </Tooltip>

                                {/* Edit Button */}
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

                                {/* Delete Button */}
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
                        ))
                      )
                    }
                  </Await>
                </React.Suspense>
              </tbody>
            </table>
          </div>
        </TooltipProvider>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2 p-4">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;

            const newParams = new URLSearchParams(searchParams);

            if (pageNum === 1) {
              newParams.delete("page");
            } else {
              newParams.set("page", pageNum.toString());
            }

            return (
              <Link
                key={pageNum}
                to={`?${newParams.toString()}`}
                className={`px-3 py-1 border rounded ${
                  isActive ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                } hover:bg-blue-100`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      </Card>
    </main>
  );
}

export default ListDonation;
