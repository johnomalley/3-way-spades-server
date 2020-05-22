import { GameRequest } from './gameMiddleware'
import { Response } from 'express'
import { putGame } from './gameBucket'
import getPlayerView from './getPlayerView'
import showHand from '../model/showHand'
import { tryReleaseLock } from './stateLock'

export default async ({ game, playerId }: GameRequest, res: Response) => {
  try {
    const player = game.players.find(_ => _.id === playerId)!
    const newGame = showHand(game, playerId)
    await putGame(newGame)
    res.json(getPlayerView(newGame, player.id))
  } finally {
    await tryReleaseLock(game.id)
  }
}
