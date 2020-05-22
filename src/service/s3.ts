import * as S3 from 'aws-sdk/clients/s3' // eslint-disable-line
import { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3' // eslint-disable-line

let sharedClient: S3

const getClient = (): S3 => {
  if (!sharedClient) {
    sharedClient = new S3()
  }
  return sharedClient
}

const getObject = async (args: GetObjectRequest): Promise<string | undefined> => {
  try {
    const result = await getClient().getObject(args).promise()
    return result.Body as string
  } catch (error) {
    if (error.statusCode === 404) {
      return undefined
    } else {
      throw error
    }
  }
}

const putObject = async (args: PutObjectRequest): Promise<void> => {
  await getClient().putObject(args).promise()
}

export default {
  getObject,
  putObject
}
