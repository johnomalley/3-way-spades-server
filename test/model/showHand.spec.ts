import { Game, Player } from '../../src/model/types'
import createGame from '../../src/model/createGame'
import showHand from '../../src/model/showHand'

describe('showHand', () => {
  let game: Game
  let player: Player

  beforeEach(() => {
    game = createGame()
    player = game.players[game.hands[0].currentPlayerNumber]
  })

  it('throws validation error if hand has already been shown', () => {
    game = showHand(game, player.id)

    expect(() => showHand(game, player.id)).toThrow(
      `Player ${player.name} may not show cards because cards have already been shown`
    )
  })

  it('updates player hand', () => {
    const [hand] = game.hands
    const updated = showHand(game, player.id)
    expect(updated).toEqual({
      ...game,
      hands: [
        {
          ...hand,
          playerHands: hand.playerHands.map((playerHand, i) =>
            i === player.number ? { ...playerHand, cardsVisible: true } : playerHand)
        }
      ]
    })
  })
})
