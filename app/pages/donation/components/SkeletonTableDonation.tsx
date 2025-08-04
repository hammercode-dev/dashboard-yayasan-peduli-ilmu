export default function SkeletonTableDonation({ length }: { length: number }) {
  return (
    <>
      {Array.from({ length: length }).map((_, i) => (
        <tr key={i} className="hover:bg-gray-50">
          {/* No */}
          <td className="px-4 py-3 border-b">
            <div className="h-4 w-6 bg-gray-200 rounded" />
          </td>

          {/* Judul */}
          <td className="px-4 py-3 border-b">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </td>

          {/* Lokasi */}
          <td className="px-4 py-3 border-b">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>

          {/* Target */}
          <td className="px-4 py-3 border-b">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>

          {/* Terkumpul (with progress bar) */}
          <td className="px-4 py-3 border-b w-48">
            <div className="mb-2 h-4 w-24 bg-gray-200 rounded" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-1/2" />
            </div>
          </td>

          {/* Status */}
          <td className="px-4 py-3 border-b">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </td>

          {/* Berakhir */}
          <td className="px-4 py-3 border-b">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>

          {/* Aksi */}
          <td className="px-4 py-3 border-b text-center">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-8 w-20 bg-gray-200 rounded-md" />
              ))}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
