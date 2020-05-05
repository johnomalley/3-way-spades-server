import { Game, Hand } from './types'
import createId from './createId'
import createHand from './createHand'
import bid from './bid'
import last = require('lodash/last')
import moment = require('moment')

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
  names?: ReadonlyArray<string>
  firstHand?: Hand
  bids?: number[]
}>

export default (options: GameOptions = {}): Game => {
  const names = options.names || defaultPlayerNames
  if (names.length !== defaultPlayerNames.length) {
    throw new Error('bad player names')
  }
  const players = names.map((name, i) => ({
    id: createId(),
    number: i,
    name,
    points: 0
  }))
  const hand = options.firstHand || createHand({ playerCount: names.length })
  const now = moment()
  const game = {
    id: createId(),
    startTime: now.toISOString(),
    timestamp: now.valueOf(),
    winningScore: 500,
    players,
    hands: [hand]
  }
  return maybeAddBidding(game, options)
}
