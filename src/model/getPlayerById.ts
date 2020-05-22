import { Game, Player } from './types'
import validationError from './validationError'

export default (game: Game, playerId: string): Player => {
  const player = game.players.find(_ => _.id === playerId)
  if (player) {
    return player
  } else {
    throw validationError(`Player with ID ${playerId} not found`)
  }
}
