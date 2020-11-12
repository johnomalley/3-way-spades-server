import createShuffledDeck from '../../src/model/createShuffledDeck'
import cardSortComparator from '../../src/model/cardSortComparator'
import { Card, Suit } from '../../src/model/types'
import range = require('lodash/range')

describe('createShuffledDeck', () => {
  const isOrdered = (deck: ReadonlyArray<Card>) => {
    let i = 0
    for (const suit of [Suit.Spades, Suit.Hearts, Suit.Clubs, Suit.Diamonds]) {
      for (const rank of range(14, suit === Suit.Diamonds ? 2 : 1, -1)) {
        if (deck[i].suit !== suit || deck[i].rank !== rank) {
          return false
        }
        i++
      }
    }
    return true
  }

  it('includes all 51 cards', () => {
    const deck = createShuffledDeck()

    expect(isOrdered(deck)).toBe(false)
    expect(isOrdered([...deck].sort(cardSortComparator))).toBe(true)
  })
})
