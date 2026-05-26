import { setupServer } from "msw/node";
import { handlers } from "./handlers";

declare global {
  var __mswServer: ReturnType<typeof setupServer> | undefined;
}

if (!globalThis.__mswServer) {
  const server = setupServer(...handlers);
  server.listen({ onUnhandledRequest: "warn" });
  globalThis.__mswServer = server;
  console.log("[msw] node server listening");
}
