import client from './obyte';
import { env } from '#/app/env';
import { aaStateStore } from '#/shared/store/aa-state'
import { governanceStateStore } from '#/shared/store/governance-state'

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  console.info('log: connected to obyte hub');

  // main AA loading
  client.justsaying('light/new_aa_to_watch', {
    aa: env.VITE_AA_ADDRESS,
  });

  aaStateStore.setState((prev) => ({ ...prev, status: 'loading' }));

  const vars = (await client.api.getAaStateVars({
    address: env.VITE_AA_ADDRESS,
  })) as Record<string, unknown>;

  console.info('log: vars loaded', Object.keys(vars).length);

  // governance AA loading
  const constants = vars.constants as
    | { governance_aa: string; asset: string; launch_ts: number; }
    | undefined

  if (!constants) {
    throw new Error('Failed to load vars: constants not found');
  }

  client.justsaying('light/new_aa_to_watch', {
    aa: constants.governance_aa,
  });

  aaStateStore.setState(() => ({ status: 'loaded', vars }));

  governanceStateStore.setState((prev) => ({ ...prev, status: 'loading' }));

  const governanceVars = await client.api.getAaStateVars({
    address: constants.governance_aa,
  });

  console.info('log: governance vars loaded', Object.keys(governanceVars).length);

  governanceStateStore.setState(() => ({ status: 'loaded', vars: governanceVars }));


  // heartbeat
  heartbeatInterval = setInterval(() => {
    client.api.heartbeat();
  }, 10 * 1000);

  // @ts-expect-error - client.client.ws is not typed
  client.client.ws.addEventListener('close', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = undefined;
    }
  })
}
