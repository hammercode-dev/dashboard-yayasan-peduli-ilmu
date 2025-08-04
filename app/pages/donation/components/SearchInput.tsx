import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import useDebounce from "~/hooks/use-debounce";

type SearchInputProps = {
  search?: string;
  handleChange: (key: string, value: string) => void;
};

function SearchInput({ search, handleChange }: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(search || "");
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    handleChange("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Input
      type="search"
      defaultValue={search}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Cari judul program donation"
      className="w-full sm:w-82"
    />
  );
}

export default SearchInput;
