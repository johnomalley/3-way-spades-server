import omit = require('lodash/omit')
import config from '../config'
import { BaseGame, Game } from '../model/types'
import s3 from './s3'

const { gameStateBucket } = config

export const gameKey = (gameId: string) => `${gameId}/state.json`

export const timestampKey = (gameId: string) => `${gameId}/timestamp.txt`

export const activeGamesKey = 'active-games.json'

const get = (key: string): Promise<string | undefined> => s3.getObject({
  Bucket: gameStateBucket,
  Key: key
})

export const getGame = async (id: string): Promise<Game | undefined> => {
  const json = await get(gameKey(id))
  return json ? JSON.parse(json) as Game : undefined
}

export const getTimestamp = async (id: string): Promise<number | undefined> => {
  const text = await get(timestampKey(id))
  return text ? Number(text) : undefined
}

const put = (key: string, value: string, contentType: string) =>
  s3.putObject({
    Bucket: gameStateBucket,
    Key: key,
    Body: value,
    ContentType: contentType
  })

const putJson = async (key: string, value: object) =>
  put(key, JSON.stringify(value), 'application/json')

export const getActiveGames = async (): Promise<ReadonlyArray<BaseGame>> => {
  const json = await get(activeGamesKey)
  return json ? JSON.parse(json) as ReadonlyArray<BaseGame> : []
}

const updateActiveGames = async (game: BaseGame) => {
  const update = async (newValue: ReadonlyArray<BaseGame>) => {
    await putJson(activeGamesKey, newValue)
  }

  const activeGames = await getActiveGames()
  if (game.endTime) {
    await update(activeGames.filter(_ => _.id !== game.id))
  } else {
    const match = activeGames.find(_ => _.id === game.id)
    if (!match) {
      await update([game, ...activeGames])
    } else if (match.timestamp !== game.timestamp) {
      await update(activeGames.map(_ => _.id === game.id ? game : _))
    }
  }
}

export const putGame = async (game: Game): Promise<void> => {
  await putJson(gameKey(game.id), game)
  await put(timestampKey(game.id), String(game.timestamp), 'text/plain')
  await updateActiveGames(omit(game, 'hands'))
}
