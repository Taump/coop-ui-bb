import client from '#/services/obyte'

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  console.log('connected to obyte hub')

  heartbeatInterval = setInterval(() => {
    client.api.heartbeat()
  }, 10 * 1000)

  client.client.ws.addEventListener('close', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = undefined
    }
  })
}
