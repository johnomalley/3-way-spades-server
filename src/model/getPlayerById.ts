import { Game, Player } from './types'

export default (game: Game, playerId: string): Player => {
  const player = game.players.find(_ => _.id === playerId)
  if (player) {
    return player
  } else {
    throw new Error(`Player with ID ${playerId} not found`)
  }
}
