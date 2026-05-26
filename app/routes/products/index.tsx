import { Link } from "react-router";
import type { Route } from "./+types/index";

export async function loader() {
  const res = await fetch("http://localhost/api/products");
  return {
    products: (await res.json()) as Array<{ id: string; name: string }>,
  };
}

export default function ProductIndex({ loaderData }: Route.ComponentProps) {
  return (
    <ul>
      {loaderData.products.map((p) => (
        <li key={p.id} className="py-1">
          <Link
            to={`/products/${p.id}`}
            className="text-blue-700 hover:underline"
          >
            {p.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
