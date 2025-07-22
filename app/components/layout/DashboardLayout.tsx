import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { DashboardSidebar } from "~/components/common/DashboardSidebar";
import { Outlet, useLocation } from "react-router";
import { getPageTitle } from "~/lib/get-page-title";

const DashboardLayout = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold">{pageTitle}</h1>
        </header>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
