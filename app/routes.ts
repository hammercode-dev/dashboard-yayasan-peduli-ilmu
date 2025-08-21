import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

const layoutPaths = (path: string) => {
  return `components/layout/${path}.tsx`;
};

// list routing
export default [
  layout(layoutPaths("BaseLayout"), [
    layout(layoutPaths("DashboardLayout"), [
      index("routes/home.tsx"),
      ...prefix("donation", [index("routes/donation.tsx"), route("/create", "routes/donation/create.tsx")]),
    ]),
    // Auth
    route("/auth/sign-in", "routes/auth/signIn.tsx"),
    route("/auth/sign-up", "routes/auth/signUp.tsx"),

    route("*", "pages/NotFound.tsx"),
  ]),
] satisfies RouteConfig;
