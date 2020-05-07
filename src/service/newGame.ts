import createGame from '../model/createGame'
import { BasePlayer } from '../model/types'
import { putGame } from './gameBucket'

export type NewGameResult = Readonly<{
  id: string
}>

export default async (players?: ReadonlyArray<BasePlayer>): Promise<NewGameResult> => {
  const game = createGame({ players })
  await putGame(game)
  return { id: game.id }
}
