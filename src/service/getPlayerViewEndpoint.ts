import { Response } from 'express'
import { GameRequest } from './gameMiddleware'
import getPlayerView from './getPlayerView'

// async just because createEndpoint requires it
export default async ({ game, playerId }: GameRequest, res: Response) => {
  res.json(getPlayerView(game, playerId))
}
