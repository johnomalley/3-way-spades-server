import createGame, { defaultPlayers } from '../../src/model/createGame'

describe('createGame', () => {
  it('initializes new game', () => {
    const game = createGame()
    const { hands } = game
    expect(hands.length).toBe(1)
    expect(game).toEqual({
      id: game.id,
      startTime: game.startTime,
      timestamp: game.timestamp,
      winningScore: 500,
      players: defaultPlayers.map(({ id, name }, i) => ({
        id,
        number: i,
        name,
        points: 0
      })),
      handCount: 1,
      hands
    })
  })
})
