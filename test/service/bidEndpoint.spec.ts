import bid from '../../src/model/bid'
import bidEndpoint from '../../src/service/bidEndpoint'
import getPlayerView from '../../src/service/getPlayerView'
import { putGame } from '../../src/service/gameBucket'
import { Game, Player } from '../../src/model/types'
import createGame from '../../src/model/createGame'
import withGame from '../../src/service/withGame'

jest.mock('../../src/model/bid')
jest.mock('../../src/service/getPlayerView')
jest.mock('../../src/service/gameBucket')
jest.mock('../../src/service/withGame')

describe('bid', () => {
  const mocks = {
    bid: bid as jest.Mock,
    withGame: withGame as jest.Mock,
    putGame: putGame as jest.Mock,
    getPlayerView: getPlayerView as jest.Mock,
    status: jest.fn(),
    json: jest.fn()
  }

  let game: Game
  let player: Player
  let body: any

  const res = {
    status: mocks.status,
    json: mocks.json
  } as any

  const fakeResponse = {
    fake: true
  }

  beforeEach(() => {
    res.status.mockReturnValue(res)
    mocks.getPlayerView.mockReturnValue(fakeResponse)
    game = createGame()
    player = game.players[game.hands[0].currentPlayerNumber]
    body = {}
  })

  afterEach(() => {
    Object.values(mocks).forEach(_ => _.mockReset())
  })

  const apply = async () => {
    await bidEndpoint({ body } as any, res)
    const callback = mocks.withGame.mock.calls[0][2]
    await callback(game, player.id)
  }

  it('responds with 400 when value is not a number', async () => {
    await apply()

    expect(mocks.status).toHaveBeenCalledWith(400)
    expect(mocks.json).toHaveBeenCalledWith({
      message: 'Bid value is missing or invalid: undefined'
    })
  })

  it('delegates to bid ', async () => {
    body.value = 42.42 // let the bid fn validate
    const fakeGame: any = { type: 'fake' }
    mocks.bid.mockReturnValue(fakeGame)
    await apply()

    expect(mocks.putGame).toHaveBeenCalledWith(fakeGame)
    expect(mocks.bid).toHaveBeenCalledWith(game, player.id, body.value)
    expect(mocks.getPlayerView).toHaveBeenCalledWith(fakeGame, player.id)
    expect(mocks.status).not.toHaveBeenCalled()
    expect(mocks.json).toHaveBeenCalledWith(fakeResponse)
  })
})
