import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import config from '../config'
import { Game } from '../model/types'

const tableName = config.tables.game

let sharedClient: DocumentClient

const getClient = (): DocumentClient => {
  if (!sharedClient) {
    sharedClient = new DocumentClient()
  }
  return sharedClient
}

const get = async (id: string): Promise<Game | undefined> => {
  const client = getClient()
  const { Item } = await client.get({
    TableName: tableName,
    Key: { id }
  }).promise()
  return Item as Game | undefined
}

const put = async (game: Game): Promise<void> => {
  const client = getClient()
  await client.put({
    TableName: tableName,
    Item: game
  }).promise()
}

const del = async (id: string): Promise<void> => {
  const client = getClient()
  await client.delete({
    TableName: tableName,
    Key: { id },
    ConditionExpression: 'attribute_exists(id)'
  }).promise()
}

export default {
  get,
  put,
  del
}
