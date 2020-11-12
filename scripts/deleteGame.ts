import * as AWS from 'aws-sdk'
import isEqual = require('lodash/isEqual')

require('../configureRegion')

const s3 = new AWS.S3()

const bucket = 'omalley-3-way-spades.ocelotconsulting.com'

const activeGamesKey = 'active-games.json'

const deleteGame = async (gameId = '2020111101_JA') => {
  const expectedKeys = [
    'state.json',
    'timestamp.txt'
  ].map(_ => `${gameId}/${_}`)

  const { Contents, NextContinuationToken } = await s3.listObjectsV2({
    Bucket: bucket,
    Prefix: `${gameId}/`
  }).promise()
  if (NextContinuationToken) {
    throw new Error('too many objects')
  }
  const keys = Contents!.map(_ => _.Key!).sort()

  if (!isEqual(keys, expectedKeys)) {
    throw new Error(`unexpected objects in bucket: ${keys}`)
  }

  await Promise.all(
    keys.map(_ => s3.deleteObject({
      Bucket: bucket,
      Key: _
    }).promise())
  )

  const { Body } = await s3.getObject({
    Bucket: bucket,
    Key: activeGamesKey
  }).promise()

  const activeGames = JSON.parse(Body as string) as ReadonlyArray<any>
  const json = JSON.stringify(activeGames.filter(_ => _.id !== gameId))
  await s3.putObject({
    Bucket: bucket,
    Key: activeGamesKey,
    Body: json,
    ContentType: 'application/json'
  }).promise()
}

deleteGame().then(() => {
  process.exit(0)
}).catch(error => {
  console.log(error)
  process.exit(1)
})
