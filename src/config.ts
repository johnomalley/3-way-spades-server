import * as process from 'process'

export type Config = Readonly<{
  tables: Readonly<{
    game: string
  }>
  gameStateBucket: string
  originWhitelist: ReadonlyArray<RegExp>
}>

const namespace = process.env.NAMESPACE || 'omalley'

const config: Config = {
  tables: {
    game: process.env.GAME_TABLE_NAME || `${namespace}-3-way-spades-game`
  },
  gameStateBucket: process.env.GAME_STATE_BUCKET || `${namespace}-3-way-spades.ocelotconsulting.com`,
  originWhitelist: [
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/larry-john-michael-spades.s3-website.us-east-2.amazonaws.com/
  ]
}

export default config
