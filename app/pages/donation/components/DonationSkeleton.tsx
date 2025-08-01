import { Card } from "~/components/ui/card";

export default function DonationSkeleton() {
  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-8 w-40 bg-gray-300 rounded" />
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["No", "Judul", "Lokasi", "Target", "Terkumpul", "Status", "Berakhir", "Aksi"].map((heading, i) => (
                <th key={i} className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-6 gap-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    </main>
  );
}
