import { Game, Hand } from './types'
import createHand from './createHand'
import bid from './bid'
import last = require('lodash/last')
import * as randomstring from 'randomstring'
import moment = require('moment')
import createGameId from './createGameId'

const createPlayerId = (name: string): string =>
  name.charAt(0).toUpperCase() + randomstring.generate({
    charset: 'alphabetic',
    length: 4,
    capitalization: 'uppercase'
  })

export const defaultPlayerNames = [
  'Larry',
  'Michael',
  'John'
]

const maybeAddBidding = (game: Game, options: GameOptions): Game => {
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
    id: createPlayerId(name),
    number: i,
    name,
    points: 0
  }))
  const hand = options.firstHand || createHand({ playerCount: names.length })
  const now = moment()
  const game = {
    id: createGameId(),
    startTime: now.toISOString(),
    timestamp: now.valueOf(),
    winningScore: 500,
    players,
    hands: [hand]
  }
  return maybeAddBidding(game, options)
}
