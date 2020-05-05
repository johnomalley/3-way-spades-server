import { Card } from './types'

// reverse suit order, reverse rank order
export default (a: Card, b: Card) => {
  if (a.suit < b.suit) {
    return 1
  } else if (a.suit > b.suit) {
    return -1
  } else {
    return a.rank > b.rank ? -1 : 1
  }
}
