import * as randomstring from 'randomstring'

export default (): string =>
  randomstring.generate({
    charset: 'alphabetic',
    length: 8,
    capitalization: 'uppercase'
  })
