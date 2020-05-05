import { Hand } from './types'
import last = require('lodash/last')

export default (hands: ReadonlyArray<Hand>, update: Partial<Hand>): ReadonlyArray<Hand> => {
  const lastHand = last(hands)!
  return [
    ...hands.slice(0, hands.length - 1),
    {
      ...lastHand,
      ...update
    }
  ]
}
