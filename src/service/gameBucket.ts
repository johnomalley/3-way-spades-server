import * as S3 from 'aws-sdk/clients/s3'
import config from '../config'
import { Game } from '../model/types'

const { gameStateBucket } = config

let sharedClient: S3

const gameKey = (gameId: string) => `${gameId}/state.json`

const timestampKey = (gameId: string) => `${gameId}/timestamp.txt`

const getClient = (): S3 => {
  if (!sharedClient) {
    sharedClient = new S3()
  }
  return sharedClient
}

const get = async (key: string): Promise<string | undefined> => {
  try {
    const { Body } = await getClient().getObject({
      Bucket: gameStateBucket,
      Key: key
    }).promise()
    return Body as string
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const getGame = async (id: string): Promise<Game | undefined> => {
  const json = await get(gameKey(id))
  return json ? JSON.parse(json) as Game : undefined
}

export const getTimestamp = async (id: string): Promise<number | undefined> => {
  const text = await get(timestampKey(id))
  return text ? Number(text) : undefined
}

const put = async (key: string, value: string, contentType: string) => {
  await getClient().putObject({
    Bucket: gameStateBucket,
    Key: key,
    Body: value,
    ContentType: contentType
  }).promise()
}

export const putGame = async (game: Game): Promise<void> => {
  await put(gameKey(game.id), JSON.stringify(game), 'application/json')
  await put(timestampKey(game.id), String(game.timestamp), 'text/plain')
}
