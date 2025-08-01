import type { Route } from "../../../routes/+types/donation";
import { supabase } from "~/lib/supabase";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Pagination
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Search / Filter / Sort
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const sort = url.searchParams.get("sort") || "ends_at:desc";
  const [sortField, sortOrder] = sort.split(":");

  let query = supabase
    .from("program_donation")
    .select("title, location, id, target_amount, collected_amount, status, ends_at, slug", {
      count: "exact",
    });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (status !== "") {
    query = query.eq("status", status);
  }

  if (sortField && sortOrder) {
    query = query.order(sortField, { ascending: sortOrder === "asc" });
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;

  console.log({ query });

  if (error) {
    throw new Response("Failed to fetch data", { status: 500 });
  }

  return {
    data,
    total: count ?? 0,
    page,
    pageSize,
    search,
    status,
    sort,
  };
}
