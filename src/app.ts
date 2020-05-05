import * as express from 'express'
import { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import createEndpoints from './service/createEndpoints'
import errorMiddleware from './errorMiddleware'

const app = express()

app.use(bodyParser.json())

createEndpoints(app)

app.use(errorMiddleware)

// send 404s as json, not html
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Cannot ${req.method.toUpperCase()} ${req.path}`
  })
})

export default app
