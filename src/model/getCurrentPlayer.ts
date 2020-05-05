import { Game, Player } from './types'
import last = require('lodash/last')

const isComplete = (game: Game) => game.players.some(_ => _.points >= game.winningScore)

export default (game: Game, expectedPlayerId: string): Player => {
  if (isComplete(game)) {
    throw new Error(`Game ${game.id} has been completed`)
  } else {
    const hand = last(game.hands)
    const player = game.players[hand!.currentPlayerNumber]!
    if (player.id !== expectedPlayerId) {
      throw new Error(`Invalid player id: ${expectedPlayerId}`)
    } else {
      return player
    }
  }
}
