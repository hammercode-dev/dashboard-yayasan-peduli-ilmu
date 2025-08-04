interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6 gap-2 p-4">
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 border rounded ${
              isActive ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-blue-100"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}
