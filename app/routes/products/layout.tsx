import { Outlet, useLocation } from "react-router";

export async function loader() {
  return { loadedAt: new Date().toISOString() };
}

export default function ProductsLayout() {
  const location = useLocation();
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">Products (nested layout)</h2>
      <p className="text-xs text-neutral-500">
        Layout path:{" "}
        <code className="rounded bg-neutral-100 px-1">{location.pathname}</code>
        . Parent loader is preserved across child navigations.
      </p>
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <Outlet />
      </div>
    </section>
  );
}
