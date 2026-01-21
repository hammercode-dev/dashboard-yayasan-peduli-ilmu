import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session) {
    redirect("/login");
  }

  // console.log("User session:", data.session);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to dashboard yayasan!</p>

      <form action="/logout" method="post">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
