import * as process from 'process'

export const positiveInteger = (name: string, defaultValue?: number): number => {
  const error = (badValue: string): Error =>
    new Error(`Expected positive integer for process.env["${name}"] - ${badValue}`)

  const rawValue = process.env[name]

  if (rawValue) {
    const value = Number(rawValue)
    if (Number.isInteger(value) && value > 0) {
      return value
    } else {
      throw error(`got: ${rawValue}`)
    }
  } else if (defaultValue !== undefined) {
    return defaultValue
  } else {
    throw error('variable not defined')
  }
}
