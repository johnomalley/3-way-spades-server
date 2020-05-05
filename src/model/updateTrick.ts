import { Card, Suit, Trick } from './types'

const getWinningCard = (cards: ReadonlyArray<Card>, suitLead?: Suit): Card => {
  let suit = suitLead || cards[0].suit
  let winningCard: Card | undefined
  for (const card of cards) {
    if (card.suit === Suit.Spades && suit !== Suit.Spades) {
      winningCard = undefined
      suit = Suit.Spades
    }
    if (card.suit === suit && (!winningCard || card.rank > winningCard.rank)) {
      winningCard = card
    }
  }
  return winningCard!
}

export default (previousState: Trick, card: Card, playerCount: number, suitLead?: Suit): Trick => {
  const cards = [...previousState.cards, card]
  if (cards.length < playerCount) {
    return {
      ...previousState,
      cards
    }
  } else {
    const winningCard = getWinningCard(cards, suitLead)
    return {
      ...previousState,
      winner: (previousState.leader + cards.indexOf(winningCard)) % cards.length,
      cards
    }
  }
}
