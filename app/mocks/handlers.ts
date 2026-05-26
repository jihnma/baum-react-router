import { http, HttpResponse, delay } from "msw";

type Product = { id: string; name: string; price: number; stock: number };

const products: Product[] = [
  { id: "p1", name: "Mechanical Keyboard", price: 12000, stock: 8 },
  { id: "p2", name: "Wireless Mouse", price: 4500, stock: 24 },
  { id: "p3", name: "USB-C Hub", price: 3200, stock: 0 },
  { id: "p4", name: "Noise Cancelling Headphones", price: 28000, stock: 3 },
];

const todos: { id: string; title: string; done: boolean }[] = [
  { id: "t1", title: "Read React Router docs", done: true },
  { id: "t2", title: "Try loader/clientLoader", done: false },
  { id: "t3", title: "Compare SSR vs SPA", done: false },
];

export const handlers = [
  http.get("*/api/products", async () => {
    await delay(300);
    return HttpResponse.json(products);
  }),

  http.get("*/api/products/:id", async ({ params }) => {
    await delay(200);
    const found = products.find((p) => p.id === params.id);
    if (!found) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(found);
  }),

  http.get("*/api/todos", async () => {
    await delay(150);
    return HttpResponse.json(todos);
  }),

  http.post("*/api/todos", async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const created = {
      id: `t${todos.length + 1}`,
      title: body.title,
      done: false,
    };
    todos.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.post("*/api/echo", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ received: body, at: new Date().toISOString() });
  }),
];
