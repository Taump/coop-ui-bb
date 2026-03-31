import { createFileRoute } from "@tanstack/react-router";

import { DepositForm } from "#/features/deposit";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="max-w-lg">
      <h2 className="mb-4 text-lg font-semibold">Deposit</h2>
      <DepositForm />
    </div>
  );
}
