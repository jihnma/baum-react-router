import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";

type Submission = { name: string; email: string; age: number };

const validators = {
  name: ({ value }: { value: string }) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Too short";
  },
  email: ({ value }: { value: string }) => {
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email";
  },
  age: ({ value }: { value: number }) => {
    if (value < 0) return "Must be >= 0";
  },
};

export default function TFormRoute() {
  const [submitted, setSubmitted] = useState<Submission | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", age: 0 },
    onSubmit: async ({ value }) => {
      const res = await fetch("/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = (await res.json()) as { received: Submission };
      setSubmitted(data.received);
    },
  });

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">TanStack Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <form.Field name="name" validators={{ onChange: validators.name }}>
          {(field) => (
            <Row label="Name" field={field}>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full rounded border border-neutral-300 px-2 py-1"
              />
            </Row>
          )}
        </form.Field>

        <form.Field name="email" validators={{ onChange: validators.email }}>
          {(field) => (
            <Row label="Email" field={field}>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full rounded border border-neutral-300 px-2 py-1"
              />
            </Row>
          )}
        </form.Field>

        <form.Field name="age" validators={{ onChange: validators.age }}>
          {(field) => (
            <Row label="Age" field={field}>
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                className="w-full rounded border border-neutral-300 px-2 py-1"
              />
            </Row>
          )}
        </form.Field>

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          )}
        </form.Subscribe>
      </form>
      {submitted && (
        <pre className="rounded bg-neutral-100 p-2 text-xs">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </section>
  );
}

function Row({
  label,
  field,
  children,
}: {
  label: string;
  field: AnyFieldApi;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {!field.state.meta.isValid && (
        <span className="block text-xs text-red-700">
          {field.state.meta.errors.join(", ")}
        </span>
      )}
    </label>
  );
}
