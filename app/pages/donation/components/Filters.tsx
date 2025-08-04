import { SimpleSelect } from "~/components/ui/select";

type FiltersProps = {
  status: string;
  sort: string;
  handleChange: (key: "status" | "sort" | "search", value: string) => void;
};

function Filters({ status, sort, handleChange }: FiltersProps) {
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
