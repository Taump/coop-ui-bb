import { useStore } from "@tanstack/react-store";

import { assetMetadataStore } from "./store";

export function useAssetInfo(coopAsset: string | undefined) {
  const assetMetadata = useStore(assetMetadataStore, (s) => s);

  const coopEntry = coopAsset ? assetMetadata[coopAsset] : undefined;
  const baseEntry = assetMetadata["base"];
  const coopDecimals = coopEntry?.decimals ?? 0;
  const gbyteDecimals = baseEntry.decimals ?? 9;
  const coopSymbol = coopEntry?.symbol ?? "COOP";
  const gbyteSymbol = baseEntry.symbol ?? "GBYTE";

  return { coopAsset, coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol };
}
