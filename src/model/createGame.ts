import { Game, Hand } from './types'
import createId from './createId'
import createHand from './createHand'
import bid from './bid'
import last = require('lodash/last')

export const defaultPlayerNames = [
  'Larry',
  'Michael',
  'John'
]

const maybeAddBidding = (game: Game, options: GameOptions):Game => {
  if (options.bids) {
    const { players } = game
    let result = game
    for (const value of options.bids) {
      result = bid(result, players[last(result.hands)!.currentPlayerNumber].id, value)
    }
    return result
  } else {
    return game
  }
}

export type GameOptions = Readonly<{
  firstHand?: Hand
  bids?: number[]
}>

export default (options: GameOptions = {}): Game => {
  const players = defaultPlayerNames.map((name, i) => ({
    id: createId(),
    number: i,
    name,
    points: 0
  }))
  const hand = options.firstHand || createHand({ playerCount: defaultPlayerNames.length })
  const game = {
    id: createId(),
    winningScore: 500,
    players,
    hands: [hand]
  }
  return maybeAddBidding(game, options)
}
