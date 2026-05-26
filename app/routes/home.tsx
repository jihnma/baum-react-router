import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Patterns" },
    { name: "description", content: "Starting points for common web patterns" },
  ];
}

const sections = [
  {
    to: "/loaders",
    title: "loader vs clientLoader",
    body: "Same data, two sides. Where it runs and whether it lands in the initial HTML.",
  },
  {
    to: "/products",
    title: "Nested routes & dynamic params",
    body: "Layout + index + dynamic param child. Try /products/bad-id to see the ErrorBoundary.",
  },
  {
    to: "/forms",
    title: "<Form> vs useMutation",
    body: "Same task side-by-side. URL & state indicators show the rendering differences.",
  },
  {
    to: "/tform",
    title: "TanStack Form",
    body: "Headless form library with validation.",
  },
];

export default function Home() {
  return (
    <div className="space-y-4">
      <p className="text-neutral-600">
        Minimal starting points for common patterns. Pick one, read the source,
        copy what you need.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {sections.map((s) => (
          <li
            key={s.to}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <a href={s.to} className="font-semibold text-blue-700 underline">
              {s.title}
            </a>
            <p className="mt-1 text-sm text-neutral-600">{s.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
