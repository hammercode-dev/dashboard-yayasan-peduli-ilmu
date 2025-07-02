import { type RouteConfig, index, route } from "@react-router/dev/routes";

// list routing
export default [index("routes/home.tsx"), route("/donation", "routes/donation.tsx")] satisfies RouteConfig;
