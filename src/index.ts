import * as express from 'express'
import * as util from 'util'
import * as console from 'console'
import * as process from 'process'
import { positiveInteger } from './env'

const app = express()

const listen = util.promisify(app.listen).bind(app)

const start = async () => {
  const port = positiveInteger('PORT', 3000)
  await listen(port)
  console.log()
}

start().catch(error => {
  console.error(error.message)
  process.exit(1)
})
