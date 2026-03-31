import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/governance")({
  component: Governance,
});

function Governance() {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Governance</h2>
      <p className="text-muted-foreground">Coming soon.</p>
    </>
  );
}
