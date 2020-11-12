import s3 from '../../src/service/s3'
import createGame from '../../src/model/createGame'
import {
  activeGamesKey,
  gameKey,
  getActiveGames,
  getGame,
  getTimestamp,
  putGame,
  timestampKey
} from '../../src/service/gameBucket'
import config from '../../src/config'
import omit = require('lodash/omit')

jest.mock('../../src/service/s3')

describe('gameBucket', () => {
  const { gameStateBucket } = config

  const mocks = {
    getObject: s3.getObject as jest.Mock,
    putObject: s3.putObject as jest.Mock
  }

  const game = createGame()

  afterEach(() => {
    Object.values(mocks).forEach(_ => _.mockReset())
  })

  describe('getGame', () => {
    it('returns undefined if not found', async () => {
      mocks.getObject.mockResolvedValue(undefined)
      expect(await getGame(game.id)).toBeUndefined()
      expect(mocks.getObject).toHaveBeenCalledWith({
        Bucket: gameStateBucket,
        Key: gameKey(game.id)
      })
    })

    it('parses game as JSON when found', async () => {
      mocks.getObject.mockResolvedValue(JSON.stringify(game))
      expect(await getGame(game.id)).toEqual(game)
    })
  })

  describe('getTimestamp', () => {
    it('returns undefined if not found', async () => {
      mocks.getObject.mockResolvedValue(undefined)

      expect(await getTimestamp(game.id)).toBeUndefined()
      expect(mocks.getObject).toHaveBeenCalledWith({
        Bucket: gameStateBucket,
        Key: timestampKey(game.id)
      })
    })

    it('returns timestamp when found', async () => {
      const timestamp = Date.now()
      mocks.getObject.mockResolvedValue(String(timestamp))

      expect(await getTimestamp(game.id)).toBe(timestamp)
    })
  })

  describe('putGame', () => {
    const expectJson = (key: string, value: object) => {
      expect(mocks.putObject).toHaveBeenCalledWith({
        Bucket: gameStateBucket,
        Key: key,
        Body: JSON.stringify(value),
        ContentType: 'application/json'
      })
    }

    it('puts game as JSON', async () => {
      await putGame(game)

      expectJson(gameKey(game.id), game)
      expect(mocks.putObject).toHaveBeenCalledWith({
        Bucket: gameStateBucket,
        Key: timestampKey(game.id),
        Body: String(game.timestamp),
        ContentType: 'text/plain'
      })
      expectJson(activeGamesKey, [omit(game, 'hands')])
    })

    const initActiveGames = () => {
      const activeGames = [omit(game, 'hands')]
      mocks.getObject.mockResolvedValue(JSON.stringify(activeGames))
    }

    it('updates existing active game when timestamp does not match', async () => {
      initActiveGames()
      const updatedGame = {
        ...game,
        timestamp: game.timestamp + 1
      }
      await putGame(updatedGame)

      expectJson(activeGamesKey, [omit(updatedGame, 'hands')])
    })

    it('does not update active game when timestamp does not match', async () => {
      initActiveGames()
      await putGame(game)

      expect(mocks.putObject.mock.calls.length).toBe(2)
    })

    it('removes game from active games when game is over', async () => {
      initActiveGames()
      const updatedGame = {
        ...game,
        endTime: game.startTime
      }
      await putGame(updatedGame)

      expect(mocks.putObject.mock.calls.length).toBe(3)
      expectJson(activeGamesKey, [])
    })
  })

  describe('getActiveGames', () => {
    it('resolves to value from bucket', async () => {
      const expected = [omit(game, 'hands')]
      mocks.getObject.mockResolvedValue(JSON.stringify(expected))

      expect(await getActiveGames()).toEqual(expected)
      expect(mocks.getObject).toHaveBeenCalledWith({
        Bucket: gameStateBucket,
        Key: activeGamesKey
      })
    })

    it('resolves to empty array when missing', async () => {
      mocks.getObject.mockResolvedValue(undefined)

      expect(await getActiveGames()).toEqual([])
    })
  })
})
