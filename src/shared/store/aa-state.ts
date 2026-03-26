import { Store } from '@tanstack/store'

interface AaState {
  status: 'idle' | 'loading' | 'loaded'
  vars: object
}

export const aaStateStore = new Store<AaState>({
  status: 'idle',
  vars: {},
})
