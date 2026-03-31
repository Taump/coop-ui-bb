import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Leaderboard</h2>
      <p className="text-muted-foreground">Coming soon.</p>
    </>
  );
}
