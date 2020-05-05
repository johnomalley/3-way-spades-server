import { Express, Request, Response, NextFunction } from 'express'
import newGameEndpoint from './newGameEndpoint'
import gameMiddleware, { GameRequest } from './gameMiddleware'
import getPlayerViewEndpoint from './getPlayerViewEndpoint'
import bidEndpoint from './bidEndpoint'
import playEndpoint from './playEndpoint'
import pollForChangesEndpoint from './pollForChangesEndpoint'

const createEndpoint = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res)
    } catch (error) {
      next(error)
    }
  }

const gamePath = '/game/:gameId/player/:playerId'

type SimpleEndpoint = (req: Request, res: Response) => Promise<void>
type GameEndpoint = (req: GameRequest, res: Response) => Promise<void>
type Endpoint = SimpleEndpoint | GameEndpoint

type EndpointSpec = Readonly<{
  path: string
  method: 'get' | 'put' | 'post' | 'delete'
  endpoint: Endpoint
}>

const endpointSpecs: ReadonlyArray<EndpointSpec> = [
  {
    path: '/',
    method: 'post',
    endpoint: newGameEndpoint
  },
  {
    path: `/poll/:gameId/:playerId/:timestamp`,
    method: 'get',
    endpoint: pollForChangesEndpoint
  },
  {
    path: gamePath,
    method: 'get',
    endpoint: getPlayerViewEndpoint
  },
  {
    path: `${gamePath}/bid`,
    method: 'post',
    endpoint: bidEndpoint
  },
  {
    path: `${gamePath}/play`,
    method: 'post',
    endpoint: playEndpoint
  }
]

export default (app: Express) => {
  app.use(gamePath, gameMiddleware)
  for (const spec of endpointSpecs) {
    app[spec.method](spec.path, createEndpoint(spec.endpoint))
  }
}
