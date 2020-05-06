import * as randomstring from 'randomstring'
import moment = require('moment')

const offsetFrom = (char: string, offset: number) =>
  String.fromCharCode(char.charCodeAt(0) + offset)

const capitalLetter = (offset: number) => offsetFrom('A', offset)

const digit = (offset: number) => offsetFrom('0', offset)

export default (timestamp: number = Date.now()): string => {
  const ts = moment(timestamp)
  const yearCode = ts.format('YYYY')
  const monthCode = capitalLetter(ts.month())
  const dayNumber = ts.date() - 1
  const dayCode = dayNumber < 26 ? capitalLetter(dayNumber) : digit(dayNumber - 26)
  const hourCode = capitalLetter(ts.hour())
  const randomCode = randomstring.generate({
    charset: 'alphabetic',
    length: 3,
    capitalization: 'uppercase'
  })
  return yearCode + monthCode + dayCode + hourCode + randomCode
}
