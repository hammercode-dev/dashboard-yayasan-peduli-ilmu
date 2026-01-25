// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

import DashboardPage from '@/features/dashboard/DashboardPage'

export default async function Dashboard() {
  // const supabase = await createClient();

  // const { data, error } = await supabase.auth.getSession();

  // if (error || !data?.session) {
  //   redirect("/login");
  // }

  // console.log("User session:", data.session);

  return <DashboardPage />
}
