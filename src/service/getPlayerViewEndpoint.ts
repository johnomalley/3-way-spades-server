import { Request, Response } from 'express'
import getPlayerView from './getPlayerView'
import withGame from './withGame'

export default async (req: Request, res: Response) => {
  await withGame(req, res, async (game, playerId) => {
    res.json(getPlayerView(game, playerId))
  })
}
