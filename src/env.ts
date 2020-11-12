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
