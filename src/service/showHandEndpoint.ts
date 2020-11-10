import { Request, Response } from 'express'
import { putGame } from './gameBucket'
import getPlayerView from './getPlayerView'
import showHand from '../model/showHand'
import withGame from './withGame'

export default async (req: Request, res: Response) => {
  await withGame(req, res, async (game, playerId) => {
    const player = game.players.find(_ => _.id === playerId)!
    const newGame = showHand(game, playerId)
    await putGame(newGame)
    res.json(getPlayerView(newGame, player.id))
  })
}
