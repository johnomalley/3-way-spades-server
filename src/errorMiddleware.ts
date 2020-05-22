import { NextFunction, Request, Response } from 'express'

export default (error: any, _: Request, res: Response, next: NextFunction) => {
  if (error) {
    const { message, statusCode = 500 } = error
    const response = { ...error, message, statusCode }
    console.error(JSON.stringify(response))
    res.status(statusCode).json(response)
  } else {
    next()
  }
}
