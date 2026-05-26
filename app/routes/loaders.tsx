import type { Route } from "./+types/loaders";

type Product = { id: string; name: string; price: number };

export async function loader() {
  const res = await fetch("http://localhost/api/products");
  return {
    serverProducts: (await res.json()) as Product[],
    serverAt: new Date().toISOString(),
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const fromServer = await serverLoader();
  const res = await fetch("/api/products");
  return {
    ...fromServer,
    clientProducts: (await res.json()) as Product[],
    clientAt: new Date().toISOString(),
  };
}

// Run clientLoader on initial hydration too — without this it only runs on SPA navigation.
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p className="text-sm text-neutral-500">Loading…</p>;
}

export default function Loaders({ loaderData }: Route.ComponentProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card
        title="loader"
        runtime="server"
        at={loaderData.serverAt}
        products={loaderData.serverProducts}
        hint="View source: this list is in the HTML."
      />
      <Card
        title="clientLoader"
        runtime="browser"
        at={loaderData.clientAt}
        products={loaderData.clientProducts}
        hint="Runs after hydration. Not in initial HTML."
      />
    </div>
  );
}

function Card({
  title,
  runtime,
  at,
  products,
  hint,
}: {
  title: string;
  runtime: string;
  at: string;
  products: Product[];
  hint: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
      <header className="flex items-baseline gap-2">
        <h3 className="font-mono text-sm font-bold">{title}</h3>
        <span className="font-mono text-xs text-neutral-500">
          from react-router
        </span>
      </header>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 rounded bg-neutral-50 p-2 font-mono text-xs">
        <dt className="text-neutral-500">runtime</dt>
        <dd>{runtime}</dd>
        <dt className="text-neutral-500">ran at</dt>
        <dd>{at}</dd>
      </dl>
      <ul className="rounded border border-neutral-100 p-2 text-sm">
        {products.map((p) => (
          <li key={p.id} className="flex justify-between py-0.5">
            <span>{p.name}</span>
            <span className="text-neutral-500">
              ¥{p.price.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-neutral-500">{hint}</p>
    </div>
  );
}
