import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// list routing
export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/donation", "routes/donation.tsx"),

    // Auth
    route("sign-in", "routes/auth/signIn.tsx"),
    route("sign-up", "routes/auth/signUp.tsx"),
  ]),
] satisfies RouteConfig;
