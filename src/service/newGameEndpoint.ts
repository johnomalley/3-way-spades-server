import { Request, Response } from 'express'
import newGame from './newGame'
import isString = require('lodash/isString');

const parseBody = (req: Request): { status?: number, message?: string, names?: ReadonlyArray<string> } => {
  const raw = req.body.names
  if (!Array.isArray(raw) || raw.length !== 3 || !raw.every(isString)) {
    return {
      status: 400,
      message: 'not an array of 3 strings'
    }
  }
  const names = raw.map(_ => _.trim())
  if (names.some(_ => _.length === 0)) {
    return {
      status: 400,
      message: 'at least one name was empty'
    }
  } else {
    return { names }
  }
}

export default async (req: Request, res: Response) => {
  const { names, status, message } = parseBody(req)
  if (status) {
    res.status(status).json({ message })
  } else {
    res.json(await newGame(names!))
  }
}
