import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { Route } from "./+types/root";
import "./app.css";
import { getQueryClient } from "./lib/query-client";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/loaders", label: "Loaders" },
  { to: "/products", label: "Nested" },
  { to: "/forms", label: "Form vs Query" },
  { to: "/tform", label: "TanStack Form" },
];

export default function App() {
  const [client] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={client}>
      <div className="mx-auto max-w-4xl p-6">
        <header className="mb-6 flex flex-wrap items-center gap-3 border-b border-neutral-200 pb-4">
          <h1 className="text-lg font-semibold">Patterns</h1>
          <nav className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded px-2 py-1 ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 hover:bg-neutral-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export function HydrateFallback() {
  return <p className="p-6">Loading…</p>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold">{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
