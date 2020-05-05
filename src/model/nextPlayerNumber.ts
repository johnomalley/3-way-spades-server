import { Game } from './types'
import last = require('lodash/last')

export default (game: Game, current: number = last(game.hands)!.currentPlayerNumber) =>
  (current + 1) % game.players.length
