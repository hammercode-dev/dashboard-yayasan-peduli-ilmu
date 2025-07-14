import { AuthProvider } from "context/AuthContext";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
export default Layout;
