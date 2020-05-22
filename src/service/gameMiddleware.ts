import { NextFunction, Request, Response } from 'express'
import { Game } from '../model/types'
import { getGame } from './gameBucket'
import { acquireLock, tryReleaseLock } from './stateLock'

export interface GameRequest extends Request {
  readonly game: Game
  readonly playerId: string
}

const maybeAcquireLock = async ({ method, params }: Request): Promise<string | undefined> => {
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const gameId = params.gameId
    await acquireLock(gameId)
    return gameId
  } else {
    return undefined
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  let lockToRelease: string | undefined
  try {
    const reqAny = req as any
    const { gameId, playerId } = req.params
    lockToRelease = await maybeAcquireLock(req)
    const game = await getGame(gameId)
    if (!game) {
      res.status(404).json({
        message: `Game ${gameId} was not found`
      })
    } else if (!game.players.some(player => player.id === playerId)) {
      res.status(404).json({
        message: `Player ${playerId} does not exist for game ${gameId}`
      })
    } else {
      reqAny.game = game
      reqAny.playerId = playerId
      lockToRelease = undefined
      next()
    }
  } catch (error) {
    next(error)
  } finally {
    if (lockToRelease) {
      // noinspection ES6MissingAwait
      await tryReleaseLock(lockToRelease)
    }
  }
}
