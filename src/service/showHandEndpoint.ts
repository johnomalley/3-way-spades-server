import { GameRequest } from './gameMiddleware'
import { Response } from 'express'
import { putGame } from './gameBucket'
import getPlayerView from './getPlayerView'
import showHand from '../model/showHand'

export default async ({ game, playerId }: GameRequest, res: Response) => {
  const player = game.players.find(_ => _.id === playerId)!
  const newGame = showHand(game, playerId)
  await putGame(newGame)
  res.json(getPlayerView(newGame, player.id))
}
