import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useWallet } from "#/entities/user";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useGovernanceState } from "#/entities/governance";
import { ConnectWalletDialog } from "#/features/connect-wallet";
import {
  GovernanceProfile,
  GovernanceParamList,
  GovernanceProfileSkeleton,
  GovernanceParamListSkeleton,
} from "#/features/governance";

export const Route = createFileRoute("/governance")({
  component: Governance,
});

function Governance() {
  const { address } = useWallet();
  const { status: coopStatus, constants } = useCoopState();
  const { coopDecimals, coopSymbol } = useAssetInfo(constants?.asset);
  const { status: govStatus, params } = useGovernanceState(address);

  const governanceAa = constants?.governance_aa;
  const isLoaded = coopStatus === "loaded" && govStatus === "loaded";

  const introParts = m
    .governance_connect_wallet_intro({ wallet: "[WALLET]" })
    .split("[WALLET]");

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">{m.nav_governance()}</h2>
      <div className="flex flex-col gap-8">
        {isLoaded ? (
          <GovernanceProfile
            connectWallet={
              <>
                {introParts.map((part, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <ConnectWalletDialog>
                        <button className="cursor-pointer font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground">
                          {m.wallet_add()}
                        </button>
                      </ConnectWalletDialog>
                    )}
                    {part}
                  </span>
                ))}
              </>
            }
          />
        ) : (
          <GovernanceProfileSkeleton />
        )}
        {isLoaded && governanceAa ? (
          <GovernanceParamList
            params={params}
            governanceAa={governanceAa}
            address={address}
            coopDecimals={coopDecimals}
            coopSymbol={coopSymbol}
          />
        ) : (
          <GovernanceParamListSkeleton />
        )}
      </div>
    </>
  );
}
