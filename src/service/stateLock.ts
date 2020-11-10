import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as delay from 'delay'
import config from '../config'

const client = new DocumentClient()

const isConditionalCheckFailed = (error: any) =>
  error.statusCode === 400 && error.code === 'ConditionalCheckFailedException'

const withRetry = async (description: string, fn: () => Promise<void>, retriesRemaining: number = 10) => {
  try {
    await fn()
  } catch (error) {
    if (isConditionalCheckFailed(error)) {
      if (retriesRemaining === 0) {
        throw new Error(`${description} failed after retry!`)
      } else {
        await delay(50)
        await withRetry(description, fn, retriesRemaining - 1)
      }
    }
  }
}

export const acquireLock = async (lockId: string): Promise<void> => {
  await withRetry(`acquire lock ${lockId}`, async () => {
    await client.put({
      TableName: config.gameLockTable,
      Item: { LockID: lockId },
      ConditionExpression: 'attribute_not_exists(lockId)'
    }).promise()
  })
}

export const tryReleaseLock = async (lockId: string) => {
  try {
    await withRetry(`release lock ${lockId}`, async () => {
      await client.delete({
        TableName: config.gameLockTable,
        Key: {
          LockID: lockId
        },
        ConditionExpression: 'attribute_exists(lockId)'
      }).promise()
    })
  } catch (error) {
    console.error(error)
  }
}
