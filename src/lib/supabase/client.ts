import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// "!" maksudnya bahwa di typescript dev yakin bahwa nilai tersebut tidak akan null atau undefined

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);
