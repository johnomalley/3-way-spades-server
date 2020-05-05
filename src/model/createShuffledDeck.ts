import { Suit, Card } from './types'

const swap = (deck: Card[], from: number, to: number) => {
  if (from !== to) {
    const card = deck[to]
    deck[to] = deck[from]
    deck[from] = card
  }
}
const shuffle = (deck: Card[]): void => {
  const size = deck.length
  for (let i = size - 1; i >= 0; i--) {
    swap(deck, i, Math.floor(Math.random() * size))
  }
}

export default (): ReadonlyArray<Card> => {
  const suits = [Suit.Spades, Suit.Hearts, Suit.Clubs, Suit.Diamonds]
  const minRank = 2
  const maxRank = 14
  const deck: Card[] = []
  for (let rank = minRank; rank <= maxRank; rank++) {
    for (const suit of suits) {
      if (rank !== 2 || suit !== Suit.Diamonds) {
        deck.push({ rank, suit })
      }
    }
  }
  shuffle(deck)
  return deck
}
