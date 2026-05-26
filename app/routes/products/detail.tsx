import { Link, data, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/detail";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`http://localhost/api/products/${params.id}`);
  if (!res.ok) {
    throw data({ message: `Product ${params.id} not found` }, { status: 404 });
  }
  return {
    product: (await res.json()) as {
      id: string;
      name: string;
      price: number;
      stock: number;
    },
  };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  return (
    <article className="space-y-2">
      <Link to="/products" className="text-sm text-blue-700 hover:underline">
        ← back
      </Link>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p>¥{product.price.toLocaleString()}</p>
      <p className={product.stock > 0 ? "text-green-700" : "text-red-700"}>
        {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
      </p>
    </article>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div className="space-y-2">
        <p className="font-semibold">
          {error.status} — {error.statusText}
        </p>
        <pre className="rounded bg-neutral-100 p-2 text-xs">
          {JSON.stringify(error.data, null, 2)}
        </pre>
        <Link to="/products" className="text-blue-700 hover:underline">
          ← back
        </Link>
      </div>
    );
  }
  throw error;
}
