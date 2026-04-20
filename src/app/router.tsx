import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";

import { getContext } from "./providers/query-provider";
import { getLocaleBasepath } from "#/shared/i18n";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    basepath: getLocaleBasepath() || undefined,

    context: getContext(),
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
