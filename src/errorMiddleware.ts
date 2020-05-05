import { NextFunction, Request, Response } from 'express'

export default (error: any, _: Request, res: Response, next: NextFunction) => {
  if (error) {
    const { message } = error
    console.error(error)
    res.status(500).json({ message, ...error })
  } else {
    next()
  }
}
