import * as process from 'process'

export type Config = Readonly<{
  stateLockTable: string
  gameStateBucket: string
  originWhitelist: ReadonlyArray<RegExp>
}>

const namespace = process.env.NAMESPACE || 'omalley'

const config: Config = {
  stateLockTable: process.env.STATE_LOCK_TABLE || `${namespace}-state-lock`,
  gameStateBucket: process.env.GAME_STATE_BUCKET || `${namespace}-3-way-spades.ocelotconsulting.com`,
  originWhitelist: [
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/larry-john-michael-spades.s3-website.us-east-2.amazonaws.com/
  ]
}

export default config
