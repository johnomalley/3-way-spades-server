import { BasePlayer, Game, Hand } from './types'
import createHand from './createHand'
import bid from './bid'
import createGameId from './createGameId'
import validationError from './validationError'
import last = require('lodash/last')
import moment = require('moment')

export const defaultPlayers = [
  'Larry',
  'Michael',
  'John'
].map(name => ({
  id: name.toLowerCase(),
  name
}))

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
  creator?: string
  players?: ReadonlyArray<BasePlayer>
  firstHand?: Hand
  bids?: number[]
}>

export default (options: GameOptions = {}): Game => {
  const newPlayers = options.players || defaultPlayers
  if (newPlayers.length !== defaultPlayers.length) {
    throw validationError('bad player names')
  }
  const players = newPlayers.map(({ id, name }, i) => ({
    id,
    number: i,
    name,
    points: 0,
    pointsPerHand: []
  }))
  const hand = options.firstHand || createHand({ playerCount: players.length })
  const now = moment()
  const game = {
    id: createGameId(),
    startTime: now.toISOString(),
    timestamp: now.valueOf(),
    winningScore: 500,
    players,
    handCount: 1,
    hands: [hand]
  }
  return maybeAddBidding(game, options)
}
