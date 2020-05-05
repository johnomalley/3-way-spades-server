import { NextFunction, Request, Response } from 'express'
import { Game } from '../model/types'
import db from './db'

export interface GameRequest extends Request {
  readonly game: Game
  readonly playerId: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const reqAny = req as any
  const { gameId, playerId } = req.params
  const game = await db.get(gameId)
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
}
