import client from './obyte';
import { env } from '#/app/env';
import { aaStateStore } from '#/shared/store/aa-state';

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  console.log('log: connected to obyte hub')

  client.justsaying('light/new_aa_to_watch', {
    aa: env.VITE_AA_ADDRESS,
  });

  aaStateStore.setState((prev) => ({ ...prev, status: 'loading' }))

  const vars = await client.api.getAaStateVars({
    address: env.VITE_AA_ADDRESS,
  })

  aaStateStore.setState(() => ({ status: 'loaded', vars }))

  console.log('log: vars loaded', Object.keys(vars).length)

  heartbeatInterval = setInterval(() => {
    client.api.heartbeat()
  }, 10 * 1000)

  // @ts-expect-error - client.client.ws is not typed
  client.client.ws.addEventListener('close', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = undefined
    }
  })
}
