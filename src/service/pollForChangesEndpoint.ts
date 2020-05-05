import { Request, Response } from 'express'
import getPlayerView from './getPlayerView'
import { getGame, getTimestamp } from './gameBucket'

export default async ({ params: { timestamp, gameId, playerId } }: Request, res: Response) => {
  const tsValue = Number(timestamp)
  const currentTimestamp = await getTimestamp(gameId)
  if (!currentTimestamp) {
    res.status(404).json({
      message: `Game ${gameId} was not found`
    })
  } else if (tsValue === currentTimestamp) {
    res.json({})
  } else {
    const game = await getGame(gameId)
    res.json({
      update: getPlayerView(game!, playerId)
    })
  }
}
