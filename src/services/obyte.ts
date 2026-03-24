import obyte from 'obyte'

import { env } from '#/env'
import { bootstrap } from '#/bootstrap'

const testnet = env.VITE_TESTNET ?? false

const client = new obyte.Client(
  `wss://obyte.org/bb${testnet ? '-test' : ''}`,
  {
    testnet,
    reconnect: true,
  },
)

client.onConnect(bootstrap)

export default client
