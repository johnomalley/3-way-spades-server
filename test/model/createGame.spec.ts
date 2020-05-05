import createGame, { defaultPlayerNames } from '../../src/model/createGame'

describe('createGame', () => {
  it('initializes new game', () => {
    const game = createGame()
    const { hands, players } = game
    const playerIds = players.map(_ => _.id)
    expect(hands.length).toBe(1)
    expect(game).toEqual({
      id: game.id,
      winningScore: 500,
      players: defaultPlayerNames.map((name, i) => ({
        id: playerIds[i],
        number: i,
        name,
        points: 0
      })),
      hands
    })
  })
})
