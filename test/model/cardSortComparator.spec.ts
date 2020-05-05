import { Suit } from '../../src/model/types'
import cardSortComparator from '../../src/model/cardSortComparator'

describe('cardSortComparator', () => {
  const newCard = (rank: number, suit: Suit = Suit.Spades) => ({ suit, rank })

  it('sorts by suit first', () => {
    expect(cardSortComparator(newCard(2), newCard(14, Suit.Hearts))).toBe(-1)
    expect(cardSortComparator(newCard(14, Suit.Diamonds), newCard(5, Suit.Clubs))).toBe(1)
  })

  it('sorts by rank if suits match', () => {
    expect(cardSortComparator(newCard(3), newCard(4))).toBe(1)
    expect(cardSortComparator(newCard(4), newCard(3))).toBe(-1)
  })
})
