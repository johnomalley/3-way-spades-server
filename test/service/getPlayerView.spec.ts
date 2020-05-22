import getPlayerView from '../../src/service/getPlayerView'
import createGame from '../../src/model/createGame'
import { Game, Hand, Player } from '../../src/model/types'
import showHand from '../../src/model/showHand'

describe('getPlayerView', () => {
  let game: Game
  let hand: Hand
  let player: Player

  beforeEach(() => {
    game = createGame()
    hand = game.hands[0]
    player = game.players[game.hands[0].currentPlayerNumber]
  })

  const apply = () => getPlayerView(game, player.id)

  it('does not include cards when not shown', () => {
    expect(apply()).toEqual({
      cardsInHand: [],
      cardsPlayed: [],
      cardsVisible: false,
      currentPlayerNumber: player.number,
      gameId: game.id,
      phase: hand.phase,
      playerNumber: player.number,
      players: game.players.map(({ name, number, points, pointsPerHand }) => ({
        name,
        points,
        pointsPerHand,
        trickCount: hand.playerHands[number].trickCount
      })),
      startTime: game.startTime,
      timestamp: game.timestamp,
      tricks: []
    })
  })

  it('includes cards when shown', () => {
    game = showHand(game, player.id)
    const { cardsInHand, cardsVisible } = apply()

    expect(cardsInHand).toBe(hand.playerHands[player.number].cardsInHand)
    expect(cardsVisible).toBe(true)
  })
})
