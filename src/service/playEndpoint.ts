import { Response } from 'express'
import { GameRequest } from './gameMiddleware'
import { Card, Suit } from '../model/types'
import play from '../model/play'
import getPlayerView from './getPlayerView'
import { putGame } from './gameBucket'

const parseBody = (body: any): { status?: number, message?: string, card?: Card } => {
  const { rank, suit } = body
  if (Number.isInteger(rank) && Number.isInteger(suit)) {
    const card = { rank, suit } as Card
    if (rank >= 2 && rank <= 14 && suit >= Suit.Diamonds && suit <= Suit.Spades) {
      return { card }
    }
  }
  return {
    status: 400,
    message: `Malformed body - needs rank and suit: ${JSON.stringify(body)}`,
  }
}

export default async ({  body, game, playerId }: GameRequest, res: Response) => {
  const { status, message, card } = parseBody(body)
  if (status) {
    res.status(status).json({ message })
  } else {
    const newGame = play(game, playerId, card!)
    await putGame(newGame)
    res.json(getPlayerView(newGame, playerId))
  }
}
