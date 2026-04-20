import { Fragment } from "react";

import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import type { GovernanceParamDef } from "#/shared/config/appConfig";

import { formatParamValue } from "../lib/formatParamValue";

interface ParamValueProps {
  value: string | number;
  def: GovernanceParamDef;
  coopDecimals: number;
  coopSymbol: string;
}

export function ParamValue({
  value,
  def,
  coopDecimals,
  coopSymbol,
}: ParamValueProps) {
  if (def.type !== "string") {
    return <>{formatParamValue(value, def, coopDecimals, coopSymbol)}</>;
  }

  const addresses = String(value).split(":");

  return (
    <>
      {addresses.map((addr, i) => (
        <Fragment key={i}>
          {i > 0 && ", "}
          <a
            href={getExplorerUrl(addr, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {addr.slice(0, 4)}...{addr.slice(-4)}
          </a>
        </Fragment>
      ))}
    </>
  );
}
