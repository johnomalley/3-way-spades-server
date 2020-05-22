import { ValidationError } from './types'

export default (message: string): ValidationError => {
  const error: any = new Error(message)
  error.statusCode = 400
  return error
}
