import { Request, Response } from 'express'
import { getActiveGames } from './gameBucket'

export default async (_: Request, res: Response) => {
  res.json(await getActiveGames())
}
