import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { supabase } from "~/lib/supabase";

import type { Route } from "./+types/update";
import FormUpdateDonation from "~/pages/donation/FormUpdateDonation";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("Missing id in route params", { status: 400 });
  }

  const { data, error } = await supabase.from("program_donation").select(`*`).eq("id", id).single();

  if (error) {
    throw new Response(error.message, { status: 500 });
  }
  if (!data) {
    throw new Response("Program not found", { status: 404 });
  }

  return { data };
}

export default function UpdateDonation(_: Route.ComponentProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/donation">Donations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Update Program</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <FormUpdateDonation />
      </div>
    </div>
  );
}
