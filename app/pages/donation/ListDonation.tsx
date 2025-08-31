import { Link, useSearchParams, useNavigation } from "react-router";

import SearchInput from "./components/SearchInput";
import TableDonation from "./components/TableDonation";
import Filters from "~/pages/donation/components/Filters";

import type { ShowDonationItem } from "./types";

type DonationLoaderData = {
  data: ShowDonationItem[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: string;
  sort: string;
};

type ListDonationProps = {
  listData: DonationLoaderData;
};

function ListDonation({ listData }: ListDonationProps) {
  const { data, total, page, pageSize, search, status, sort } = listData;

  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);
  const isLoading = navigation.state === "loading";

  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (["search", "status", "sort"].includes(key)) {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
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

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <SearchInput search={search} handleChange={handleChange} />
        <Filters status={status} sort={sort} handleChange={handleChange} />
      </div>

      <TableDonation data={data} isLoading={isLoading} page={page} pageSize={pageSize} totalPages={totalPages} />
    </div>
  );
}

export default ListDonation;
