import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

const layoutPaths = (path: string) => {
  return `components/layout/${path}.tsx`;
};

// list routing
export default [
  layout(layoutPaths("BaseLayout"), [
    layout(layoutPaths("DashboardLayout"), [index("routes/home.tsx"), route("/donation", "routes/donation.tsx")]),
    // Auth
    route("/auth/sign-in", "routes/auth/signIn.tsx"),
    route("/auth/sign-up", "routes/auth/signUp.tsx"),
  ]),
] satisfies RouteConfig;
