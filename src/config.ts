import { stringValue } from './env'

export type Config = Readonly<{
  gameLockTable: string
  gameStateBucket: string
  originWhitelist: ReadonlyArray<RegExp>
}>

const namespace = stringValue('NAMESPACE', 'omalley')
const deploymentBucket = stringValue('DEPLOYMENT_BUCKET', 'larry-john-michael-spades')
const region = stringValue('REGION', 'us-east-2')

const config: Config = {
  gameLockTable: stringValue('GAME_LOCK_TABLE', `${namespace}-game-lock`),
  gameStateBucket: stringValue('GAME_STATE_BUCKET', `${namespace}-3-way-spades.ocelotconsulting.com`),
  originWhitelist: [
    /^http:\/\/localhost:\d+$/,
    new RegExp(`^http:\\/\\/${deploymentBucket}\\.${region}\\.amazonaws\\.com$`)
  ]
}

export default config
