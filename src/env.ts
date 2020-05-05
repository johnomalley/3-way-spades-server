import * as process from 'process'

const error = (name: string, message: string) => new Error(`Environment variable ${name} - ${message}`)

export const stringValue = (name: string, defaultValue?: string): string => {
  const value = process.env[name]

  if (value) {
    return value
  } else if (defaultValue) {
    return defaultValue
  } else {
    throw error(name, 'not defined')
  }
}

export type IntValueOptions = Readonly<{
  defaultValue: number
  min: number
  max: number
}>

export const intValue = (name: string, {  defaultValue, min, max }: Partial<IntValueOptions> = {}): number => {
  const asString = stringValue(name, defaultValue === undefined ? undefined : String(defaultValue))
  const value = Number(asString)
  if (!Number.isInteger(value)) {
    throw error(name, `not an integer: ${asString}`)
  } else if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    throw error(name, `out of range: ${JSON.stringify({ min, max })}`)
  } else {
    return value
  }
}
