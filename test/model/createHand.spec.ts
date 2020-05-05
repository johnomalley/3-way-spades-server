import cardSortComparator from '../../src/model/cardSortComparator'
import { Distributions, Hand, PlayerHand, Suit } from '../../src/model/types'
import createHand from '../../src/model/createHand'

describe('createHand', () => {
  it('sorts cards', () => {
    const hand = createHand()
    const { cardsInHand, cardsPlayed } = hand.playerHands[0]
    expect(cardsPlayed).toEqual([])
    let lastCard = cardsInHand[0]
    for (const card of cardsInHand.slice(1)) {
      if (card.suit === lastCard.suit) {
        expect(card.rank).toBeLessThan(lastCard.rank)
      } else {
        expect(card.suit).toBeLessThan(lastCard.suit)
      }
      lastCard = card
    }
  })

  it('includes 51 cards - excluding the 2 of diamonds', () => {
    const { deck } = createHand()
    const sorted = [...deck].sort(cardSortComparator)

    expect(sorted.length).toBe(51)
    let nextCard = {
      rank: 14,
      suit: Suit.Spades
    }
    for (const card of sorted) {
      expect(card.rank).toEqual(nextCard.rank)
      expect(card.suit).toEqual(nextCard.suit)
      if (card.rank === 2 || (card.suit === Suit.Diamonds && card.rank === 3)) {
        nextCard = {
          rank: 14,
          suit: card.suit - 1
        }
      } else {
        nextCard = {
          rank: card.rank - 1,
          suit: card.suit
        }
      }
    }
  })

  const distOf = (playerHand: PlayerHand) => {
    const dist = [0, 0, 0, 0]
    for (const card of playerHand.cardsInHand) {
      dist[card.suit]++
    }
    dist.reverse()
    return dist
  }

  const dist = (hand: Hand): Distributions => {
    const results: Array<Array<number>> = []
    for (const playerHand of hand.playerHands) {
      results.push(distOf(playerHand))
    }
    return results
  }

  it('creates with distributions', () => {
    const distributions = [
      [5, 5, 4, 3],
      [5, 8, 2, 2],
      [3, 0, 7, 7]
    ]
    const hand = createHand({ distributions })
    expect(dist(hand)).toEqual(distributions)
  })
})
