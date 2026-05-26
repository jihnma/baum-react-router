import { Form, useLocation, useNavigation } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Route } from "./+types/forms";

type Todo = { id: string; title: string };

export async function loader() {
  const res = await fetch("http://localhost/api/todos");
  return { todos: (await res.json()) as Todo[] };
}

export async function action({ request }: Route.ActionArgs) {
  const title = String((await request.formData()).get("title") ?? "").trim();
  if (!title) return null;

  await fetch("http://localhost/api/todos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export default function FormsCompare({ loaderData }: Route.ComponentProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FormDataCard todos={loaderData.todos} />
      <ReactQueryCard />
    </div>
  );
}

function FormDataCard({ todos }: { todos: Todo[] }) {
  const nav = useNavigation();
  const { pathname, search } = useLocation();
  const submitting = nav.state === "submitting";

  return (
    <Card
      title="<Form>"
      source="react-router"
      url={pathname + search}
      state={nav.state}
    >
      <Form method="post" action="/forms" className="flex gap-2">
        <input
          name="title"
          placeholder="todo"
          className="flex-1 rounded border border-neutral-300 px-2 py-1"
        />
        <button
          disabled={submitting}
          className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
        >
          Add
        </button>
      </Form>
      <List todos={todos} />
    </Card>
  );
}

function ReactQueryCard() {
  const qc = useQueryClient();
  const { pathname, search } = useLocation();
  const [title, setTitle] = useState("");

  const todos = useQuery({
    queryKey: ["todos"],
    queryFn: async (): Promise<Todo[]> => (await fetch("/api/todos")).json(),
  });

  const add = useMutation({
    mutationFn: (t: string) =>
      fetch("/api/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: t }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
  });

  return (
    <Card
      title="useMutation"
      source="@tanstack/react-query"
      url={pathname + search}
      state={
        add.isPending ? "mutating" : todos.isFetching ? "refetching" : "idle"
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) add.mutate(title);
        }}
        className="flex gap-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="todo"
          className="flex-1 rounded border border-neutral-300 px-2 py-1"
        />
        <button
          disabled={add.isPending}
          className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>
      <List todos={todos.data} />
    </Card>
  );
}

function Card({
  title,
  source,
  url,
  state,
  children,
}: {
  title: string;
  source: string;
  url: string;
  state: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
      <header className="flex items-baseline gap-2">
        <h3 className="font-mono text-sm font-bold">{title}</h3>
        <span className="font-mono text-xs text-neutral-500">
          from {source}
        </span>
      </header>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 rounded bg-neutral-50 p-2 font-mono text-xs">
        <dt className="text-neutral-500">url</dt>
        <dd>{url}</dd>
        <dt className="text-neutral-500">state</dt>
        <dd>{state}</dd>
      </dl>
      {children}
    </div>
  );
}

function List({ todos }: { todos?: Todo[] }) {
  if (!todos) return null;
  return (
    <ul className="rounded border border-neutral-100 p-2 text-sm">
      {todos.map((t) => (
        <li key={t.id} className="py-0.5">
          {t.title}
        </li>
      ))}
    </ul>
  );
}
