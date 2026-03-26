import { Store } from '@tanstack/store'

interface GovernanceState {
  status: 'idle' | 'loading' | 'loaded'
  vars: object
}

export const governanceStateStore = new Store<GovernanceState>({
  status: 'idle',
  vars: {},
})
