import { Request, Response } from 'express'
import newGame from './newGame'
import { BasePlayer } from '../model/types'
import { ValidateResult } from './types'
import isString = require('lodash/isString')
import isObject = require('lodash/isObject')

const parsePlayer = (rawPlayer: any): BasePlayer | undefined => {
  const getString = (property: string) => {
    const value = rawPlayer[property]
    return isString(value) ? value.trim() : undefined
  }
  const id = getString('id')
  const name = getString('name')
  return id && name ? { id, name } : undefined
}

type ParseBodyResult = ValidateResult & { players?: ReadonlyArray<BasePlayer> }

const parsePlayersFromArray = (raw: ReadonlyArray<any>): ParseBodyResult => {
  const players = []
  for (const rawPlayer of raw) {
    const newPlayer = parsePlayer(rawPlayer)
    if (newPlayer) {
      players.push(rawPlayer)
    } else {
      return {
        status: 400,
        message: `not a valid player: ${JSON.stringify(rawPlayer)}`
      }
    }
  }
  return { players }
}

const parseBody = (req: Request): ValidateResult & { players?: ReadonlyArray<BasePlayer> } => {
  const raw = req.body.players
  if (!Array.isArray(raw) || !raw.every(isObject)) {
    return {
      status: 400,
      message: 'must be an array of players'
    }
  }
  if (raw.length === 0) {
    return {}
  } else {
    return parsePlayersFromArray(raw)
  }
}

export default async (req: Request, res: Response) => {
  const { players, status, message } = parseBody(req)
  if (status) {
    res.status(status).json({ message })
  } else {
    res.json(await newGame(players))
  }
}
