import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({ component: Faq });

function Faq() {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">F.A.Q.</h2>
      <p className="text-muted-foreground">Coming soon.</p>
    </>
  );
}
