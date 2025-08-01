import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { SimpleSelect } from "~/components/ui/select";
import useDebounce from "~/hooks/use-debounce";

function Filters({ search, status, sort, handleChange }) {
  const [searchValue, setSearchValue] = useState(search || "");
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    handleChange("search", debouncedSearch);
  }, [debouncedSearch]);

  const statusOptions = [
    { label: "Semua Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Closed", value: "closed" },
    { label: "Archived", value: "archived" },
  ];

  const sortOptions = [
    { label: "Berakhir Terbaru", value: "ends_at:desc" },
    { label: "Berakhir Terlama", value: "ends_at:asc" },
    { label: "Judul A-Z", value: "title:asc" },
    { label: "Judul Z-A", value: "title:desc" },
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <Input
        type="text"
        placeholder="Cari judul program..."
        defaultValue={search}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full sm:w-82"
      />

      <SimpleSelect
        options={statusOptions}
        value={status}
        onChange={(val) => handleChange("status", val)}
        className="w-48"
      />

      <SimpleSelect options={sortOptions} value={sort} onChange={(val) => handleChange("sort", val)} className="w-48" />
    </div>
  );
}

export default Filters;
