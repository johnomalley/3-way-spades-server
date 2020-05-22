import { Game, Player } from './types'
import validationError from './validationError'
import last = require('lodash/last')

const isComplete = (game: Game) => game.players.some(_ => _.points >= game.winningScore)

export default (game: Game, playerId: string): Player => {
  if (isComplete(game)) {
    throw validationError(`Game ${game.id} has been completed`)
  } else {
    const hand = last(game.hands)
    const player = game.players[hand!.currentPlayerNumber]!
    if (player.id !== playerId) {
      throw validationError(`Invalid player id: ${playerId} - should be ${player.id}`)
    } else {
      return player
    }
  }
}
