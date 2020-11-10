import { Request, Response } from 'express'
import { Game } from '../model/types'
import { acquireLock, tryReleaseLock } from './stateLock'
import { getGame } from './gameBucket'

const maybeAcquireLock = async ({ method, params }: Request): Promise<string | undefined> => {
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const gameId = params.gameId
    await acquireLock(gameId)
    return gameId
  } else {
    return undefined
  }
}

export default async (req: Request,
  res: Response,
  handler: (game: Game, playerId: string) => Promise<void>): Promise<void> => {
  const lockId = await maybeAcquireLock(req)
  try {
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
    } else {
      await handler(game, playerId)
    }
  } finally {
    if (lockId) {
      await tryReleaseLock(lockId)
    }
  }
}
