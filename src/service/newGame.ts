import createGame from '../model/createGame'
import { putGame } from './gameBucket'

export type NewGameResult = Readonly<{
  id: string
  players: ReadonlyArray<Readonly<{
    id: string
    name: string
  }>>
}>

export default async (names: ReadonlyArray<string>): Promise<NewGameResult> => {
  const game = createGame({ names })
  await putGame(game)
  return {
    id: game.id,
    players: game.players.map(({ id, name }) => ({ id, name }))
  }
}
