import { createServer, proxy } from 'aws-serverless-express'
import { Context } from 'aws-lambda'
import app from './app'

const server = createServer(app)

// noinspection JSUnusedGlobalSymbols
export const handler = (event: any, context: Context) => {
  proxy(server, event, context)
}
