import type { Route } from "./+types/donation";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Donation() {
  return (
    <div>
      <p>List Donation</p>
    </div>
  );
}
