import * as process from 'process'
import * as AWS from 'aws-sdk'

require('../configureRegion')

const lockTableName = 'omalley-game-lock'

const test = async () => {
  const client = new AWS.DynamoDB.DocumentClient()
  const gameId = 'test'

  const tryLock = async () => {
    await client.put({
      TableName: lockTableName,
      Item: {
        GameID: gameId
      },
      ConditionExpression: 'attribute_not_exists(GameID)'
    }).promise()
  }

  const unlock = async () => {
    await client.delete({
      TableName: lockTableName,
      Key: {
        GameId: gameId
      }
    })
  }

  await tryLock()
  console.log('got lock')
  try {
    await tryLock()
    console.error('!should not be here!')
  } catch (e) {
    console.error(JSON.stringify(e))
  }

  await unlock()
  console.log('unlocked')
}

test().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
})
