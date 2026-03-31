import { useStore } from "@tanstack/react-store";

import { useCoopState } from "#/entities/coop";

import { assetMetadataStore } from "./store";

export function useAssetInfo() {
  const assetMetadata = useStore(assetMetadataStore, (s) => s);
  const { constants } = useCoopState();

  const coopAsset = constants?.asset;

  const coopDecimals = coopAsset ? (assetMetadata[coopAsset].decimals ?? 0) : 0;
  const gbyteDecimals = assetMetadata["base"].decimals ?? 9;
  const coopSymbol = coopAsset
    ? (assetMetadata[coopAsset].symbol ?? "COOP")
    : "COOP";

  return { coopAsset, coopDecimals, gbyteDecimals, coopSymbol };
}
