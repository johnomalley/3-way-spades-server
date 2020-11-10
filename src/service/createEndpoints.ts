import { Express, Request, Response, NextFunction } from 'express'
import newGameEndpoint from './newGameEndpoint'
import getPlayerViewEndpoint from './getPlayerViewEndpoint'
import bidEndpoint from './bidEndpoint'
import playEndpoint from './playEndpoint'
import pollForChangesEndpoint from './pollForChangesEndpoint'
import activeGamesEndpoint from './activeGamesEndpoint'
import showHandEndpoint from './showHandEndpoint'

const createEndpoint = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res)
    } catch (error) {
      next(error)
    }
  }

const gamePath = '/game/:gameId/player/:playerId'

type Endpoint = (req: Request, res: Response) => Promise<void>

type EndpointSpec = Readonly<{
  path: string
  method: 'get' | 'put' | 'post' | 'delete'
  endpoint: Endpoint
}>

const endpointSpecs: ReadonlyArray<EndpointSpec> = [
  {
    path: '/new',
    method: 'post',
    endpoint: newGameEndpoint
  },
  {
    path: '/games/active',
    method: 'get',
    endpoint: activeGamesEndpoint
  },
  {
    path: '/poll/:gameId/:playerId/:timestamp',
    method: 'get',
    endpoint: pollForChangesEndpoint
  },
  {
    path: gamePath,
    method: 'get',
    endpoint: getPlayerViewEndpoint
  },
  {
    path: `${gamePath}/show`,
    method: 'post',
    endpoint: showHandEndpoint
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
  for (const spec of endpointSpecs) {
    app[spec.method](spec.path, createEndpoint(spec.endpoint))
  }
}
