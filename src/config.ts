import { stringValue } from './env'

export type Config = Readonly<{
  tables: Readonly<{
    game: string
  }>
}>

const namespace = stringValue('NAMESPACE', 'omalley')

const config: Config = {
  tables: {
    game: stringValue('GAME_TABLE_NAME', `${namespace}-3-way-spades-game`)
  }
}

export default config
