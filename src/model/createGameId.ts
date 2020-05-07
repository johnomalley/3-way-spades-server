import * as randomstring from 'randomstring'
import moment = require('moment')

const randomStringOptions = {
  charset: 'alphabetic',
  length: 2,
  capitalization: 'uppercase'
}

export default (timestamp: number = Date.now()): string =>
  moment(timestamp).format('YYYYMMDDHH') + '_' + randomstring.generate(randomStringOptions)
