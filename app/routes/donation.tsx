import { redirect } from "react-router";
import { supabase } from "~/lib/supabase";
import ListDonation from "~/pages/donation/ListDonation";

import type { Route } from "../routes/+types/donation";
import type { ShowDonationItem } from "~/pages/donation/types";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const sort = url.searchParams.get("sort") || "ends_at:desc";
  const [sortField, sortOrder] = sort.split(":");

  // build initial query
  let query = supabase
    .from("program_donation")
    .select("title, location, id, target_amount, collected_amount, status, ends_at, slug", {
      count: "exact",
    });

  if (search) query = query.ilike("title", `%${search}%`);
  if (status) query = query.eq("status", status);
  if (sortField && sortOrder) query = query.order(sortField, { ascending: sortOrder === "asc" });

  const { count, error: countError } = await query;
  if (countError) throw new Response("Error fetching count", { status: 500 });

  // redirect if offset exceeds total count
  if (offset >= (count ?? 0) && count !== 0) {
    url.searchParams.set("page", "1");
    throw redirect(url.pathname + "?" + url.searchParams.toString());
  }

  const { data, error } = await query.range(offset, offset + pageSize - 1);

  if (error) throw new Response("Error fetching data", { status: 500 });

  return {
    data: (data as ShowDonationItem[]) ?? [],
    total: count ?? 0,
    page,
    pageSize,
    search,
    status,
    sort,
  };
}

export default function Donation({ loaderData }: Route.ComponentProps) {
  return <ListDonation listData={loaderData} />;
}
