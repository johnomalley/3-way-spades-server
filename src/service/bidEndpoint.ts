import { Response } from 'express'
import isNumber = require('lodash/isNumber')
import { GameRequest } from './gameMiddleware'
import bid from '../model/bid'
import getPlayerView from './getPlayerView'
import { putGame } from './gameBucket'
import { ValidateResult } from './types'

const parseBody = ({ value }: any): ValidateResult & { value?: number } => {
  if (isNumber(value)) {
    return { value }
  } else {
    // don't redundantly validate the number - bid does that already
    return {
      status: 400,
      message: `Bid value is missing or invalid: ${value}`
    }
  }
}

export default async ({ body, game, playerId }: GameRequest, res: Response) => {
  const { status, message, value } = parseBody(body)
  if (status) {
    res.status(status).json({ message })
  } else {
    const newGame = bid(game, playerId, value!)
    await putGame(newGame)
    res.json(getPlayerView(newGame, playerId))
  }
}
