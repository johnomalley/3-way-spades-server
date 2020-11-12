import { Card, Hand, HandPhase, PlayerHand, Distributions, Suit } from './types'
import createShuffledDeck from './createShuffledDeck'
import cardSortComparator from './cardSortComparator'

export type HandOptions = Readonly<{
  playerCount: number
  firstToBid: number
  distributions?: Distributions
  distributionsSorted: boolean
}>

const suitComparator = (a: Card, b: Card) => {
  if (a.suit === b.suit) {
    return 0
  } else {
    return cardSortComparator(a, b)
  }
}

const deal = (deck: ReadonlyArray<Card>, options: HandOptions): ReadonlyArray<PlayerHand> => {
  const { playerCount, distributions } = options

  const initArray = (): Array<Array<Card>> => {
    const array = []
    for (let i = 0; i < playerCount; i++) {
      array.push([])
    }
    return array
  }

  const dealWithDistributions = () => {
    const result = initArray()
    const sorted = [...deck].sort(options.distributionsSorted ? cardSortComparator : suitComparator)
    const indices = [0, 1, 2, 3].map(n => n * 13)
    for (let playerIndex = 0; playerIndex < distributions!.length; playerIndex++) {
      const dist = distributions![playerIndex]
      for (let suit = Suit.Spades; suit >= Suit.Diamonds; suit--) {
        const cards = result[playerIndex]
        const newIndex = indices[suit] + dist[suit]
        if (newIndex > indices[suit]) {
          cards.push.apply(cards, sorted.slice(indices[suit], newIndex))
          indices[suit] = newIndex
        }
      }
    }
    return result
  }

  const dealFromDeck = () => {
    const result = initArray()
    for (let i = 0; i < deck.length; i++) {
      result[i % playerCount].push(deck[i])
    }
    return result
  }

  const cardsPerPlayer = options.distributions ? dealWithDistributions() : dealFromDeck()

  return cardsPerPlayer.map(cardsInHand => {
    cardsInHand.sort(cardSortComparator)
    return {
      trickCount: 0,
      cardsVisible: false,
      cardsInHand,
      cardsPlayed: []
    }
  })
}

const getOptions = (options: Partial<HandOptions>): HandOptions => {
  const { playerCount = 3, distributionsSorted = false } = options
  const { firstToBid = Math.floor(Math.random() * playerCount) } = options
  return {
    firstToBid,
    playerCount,
    distributionsSorted,
    distributions: options.distributions
  }
}

export default (partialOptions: Partial<HandOptions> = {}): Hand => {
  const options = getOptions(partialOptions)
  const deck = createShuffledDeck()
  const playerHands = deal(deck, options)

  return {
    firstToBid: options.firstToBid,
    currentPlayerNumber: options.firstToBid,
    phase: HandPhase.Bidding,
    deck,
    playerHands,
    tricks: []
  }
}
