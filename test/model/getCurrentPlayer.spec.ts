import createGame from '../../src/model/createGame'
import createHand from '../../src/model/createHand'
import { Game } from '../../src/model/types'
import getCurrentPlayer from '../../src/model/getCurrentPlayer'

describe('getCurrentPlayer', () => {
  let game: Game

  beforeEach(() => {
    game = createGame({ firstHand: createHand({ firstToBid: 0 }) })
  })

  it('resolves to current player when id matches', () => {
    const expected = game.players[0]

    expect(getCurrentPlayer(game, expected.id)).toBe(expected)
  })

  it('throws error when id does not match', () => {
    const id = game.players[1].id
    expect(() => getCurrentPlayer(game, id)).toThrow(`Invalid player id: ${id}`)
  })

  it('throws error when the game is over', () => {
    game = { ...game, winningScore: 0 }
    const id = game.players[0].id
    expect(() => getCurrentPlayer(game, id)).toThrow(`Game ${game.id} has been completed`)
  })
})
