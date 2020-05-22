import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as delay from 'delay'
import config from '../config'

const client = new DocumentClient()

const isConditionalCheckFailed = (error: any) =>
  error.statusCode === 400 && error.code === 'ConditionalCheckFailedException'

export const acquireLock = async (lockId: string, retriesRemaining: number = 10): Promise<void> => {
  try {
    await client.put({
      TableName: config.stateLockTable,
      Item: { LockID: lockId },
      ConditionExpression: 'attribute_not_exists(LockID)'
    }).promise()
  } catch (error) {
    if (isConditionalCheckFailed(error)) {
      if (retriesRemaining === 0) {
        throw new Error(`State lock ${lockId} could not be acquired!`)
      } else {
        await delay(100)
        await acquireLock(lockId, retriesRemaining - 1)
      }
    } else {
      throw error
    }
  }
}

export const tryReleaseLock = async (lockId: string) => {
  try {
    await client.delete({
      TableName: config.stateLockTable,
      Key: {
        LockID: lockId
      },
      ConditionExpression: 'attribute_exists(LockID)'
    }).promise()
  } catch (error) {
    if (isConditionalCheckFailed(error)) {
      console.error(`Warning: lock '${lockId}' could not be released!`)
    } else {
      throw error
    }
  }
}
