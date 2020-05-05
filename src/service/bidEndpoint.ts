import { Response } from 'express'
import { GameRequest } from './gameMiddleware'
import bid from '../model/bid'
import getPlayerView from './getPlayerView'
import { putGame } from './gameBucket'

const parseBody = ({ value }: any): { status?: number, message?: string, value?: number } => {
  if (Number.isInteger(value) && value >= -1 && value < 17) {
    return { value }
  } else {
    return {
      status: 400,
      message: `Bid value is missing or invalid: ${value}`
    }
  }
}

export default async ({  body, game, playerId }: GameRequest, res: Response) => {
  const { status, message, value } = parseBody(body)
  if (status) {
    res.status(status).json({ message })
  } else {
    const newGame = bid(game, playerId, value!)
    await putGame(newGame)
    res.json(getPlayerView(newGame, playerId))
  }
}
