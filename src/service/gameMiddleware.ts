import { NextFunction, Request, Response } from 'express'
import { Game } from '../model/types'
import { getGame } from './gameBucket'

export interface GameRequest extends Request {
  readonly game: Game
  readonly playerId: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqAny = req as any
    const { gameId, playerId } = req.params
    const game = await getGame(gameId)
    if (!game) {
      res.status(404).json({
        message: `Game ${gameId} was not found`
      })
    } else if (!game.players.some(player => player.id === playerId)) {
      res.status(404).json({
        message: `Player ${playerId} does not exist for game ${gameId}`
      })
    }
    reqAny.game = game
    reqAny.playerId = playerId
    next()
  } catch (error) {
    next(error)
  }
}
