import activeGamesEndpoint from '../../src/service/activeGamesEndpoint'
import { getActiveGames } from '../../src/service/gameBucket'

jest.mock('../../src/service/gameBucket')

describe('activeGamesEndpoint', () => {
  const mocks = {
    json: jest.fn(),
    getActiveGames: getActiveGames as jest.Mock
  }

  const res: any = {
    json: mocks.json
  }

  afterEach(() => {
    Object.values(mocks).forEach(_ => _.mockReset())
  })

  const apply = () => activeGamesEndpoint({} as any, res)

  it('responds with active games', async () => {
    const games = [
      { id: 'fake ' }
    ]
    mocks.getActiveGames.mockResolvedValue(games)
    await apply()

    expect(mocks.json).toHaveBeenCalledWith(games)
  })
})
