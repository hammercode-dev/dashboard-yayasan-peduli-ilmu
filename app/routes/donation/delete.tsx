import type { Route } from "./+types/delete";
import { supabase } from "~/lib/supabase";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("_action");
  if (intent === "delete") {
    const id = formData.get("id") as string;
    const { error } = await supabase.from("program_donation").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message, status: 400 };
    }

    return { ok: true };
  }
}
