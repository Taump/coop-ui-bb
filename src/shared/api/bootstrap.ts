import client from './obyte'
import { env } from '#/app/env'

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  console.log('connected to obyte hub')

  client.justsaying('light/new_aa_to_watch', {
    aa: env.VITE_AA_ADDRESS,
  });

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
