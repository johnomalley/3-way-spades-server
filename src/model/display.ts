import { Card, Suit } from './types'

export const suitDisplayValue = (suit: Suit): string => {
  switch (suit) {
    case Suit.Spades: return 'S'
    case Suit.Hearts: return 'H'
    case Suit.Diamonds: return 'D'
    case Suit.Clubs: return 'C'
    default: return '?'
  }
}

export const rankDisplayValue = (rank: number): string => {
  switch (rank) {
    case 14: return 'A'
    case 13: return 'K'
    case 12: return 'Q'
    case 11: return 'J'
    default: return String(rank)
  }
}

export const cardDisplayValue = (card: Card) => {
  return rankDisplayValue(card.rank) + suitDisplayValue(card.suit)
}
