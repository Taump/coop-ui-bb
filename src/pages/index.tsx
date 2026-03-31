import { createFileRoute } from "@tanstack/react-router";

import { DepositForm } from "#/features/deposit";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-14">
      <h1 className="mb-8 text-2xl font-bold">COOP</h1>
      <div className="max-w-lg">
        <h2 className="mb-4 text-lg font-semibold">Deposit</h2>
        <DepositForm />
      </div>
    </main>
  );
}
