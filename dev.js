const util = require('util')
require('./configureRegion')
require('ts-node').register()

const app = require('./src/app').default

const port = Number(process.env.PORT) || 3000

const listen = util.promisify(app.listen).bind(app)

const start = async () => {
  await listen(port)
  console.log(`listening on http://0.0.0.0:${port}`)
}

start().catch(error => {
  console.error(error)
  process.exit(1)
})
