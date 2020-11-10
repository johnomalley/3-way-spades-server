import { Request, Response } from 'express'
import { Card } from '../model/types'
import play from '../model/play'
import getPlayerView from './getPlayerView'
import { putGame } from './gameBucket'
import { ValidateResult } from './types'
import withGame from './withGame'

const parseBody = (body: any): ValidateResult & { card?: Card } => {
  const { rank, suit } = body
  if (Number.isInteger(rank) && Number.isInteger(suit)) {
    // no need to validate - built into the play fn
    return {
      card: { rank, suit } as Card
    }
  }
  return {
    status: 400,
    message: `Malformed body - needs rank and suit: ${JSON.stringify(body)}`
  }
}

export default async (req: Request, res: Response) => {
  await withGame(req, res, async (game, playerId) => {
    const { status, message, card } = parseBody(req.body)
    if (status) {
      res.status(status).json({ message })
    } else {
      const newGame = play(game, playerId, card!)
      await putGame(newGame)
      res.json(getPlayerView(newGame, playerId))
    }
  })
}
