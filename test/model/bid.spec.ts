import createGame from '../../src/model/createGame'
import { Game, Hand, HandPhase } from '../../src/model/types'
import bid from '../../src/model/bid'
import last = require('lodash/last')

describe('bid', () => {
  let game: Game
  let hand: Hand
  let playerId: string

  beforeEach(() => {
    game = createGame()
    hand = last(game.hands)!
    playerId = game.players[hand.currentPlayerNumber].id
  })

  const apply = (value: number) => bid(game, playerId, value)

  it('rejects non integer values', () => {
    const value = 1.32
    expect(() => apply(value)).toThrow(
      `Bid of ${value} by player ${game.players[hand.currentPlayerNumber].name} is invalid - must be an integer`
    )
  })

  it('rejects values not in [-1, 17]', () => {
    const expectOutOfRange = (value: number) => {
      expect(() => apply(value)).toThrow(
        `Bid of ${value} by player ${game.players[hand.currentPlayerNumber].name} is invalid - must be between -1 and 17`
      )
    }

    expectOutOfRange(18)
    expectOutOfRange(-2)
  })

  const completeBidding = () => {
    const { players } = game
    let playerNumber = hand.currentPlayerNumber
    for (let i = 0; i < players.length; i++) {
      game = bid(game, players[playerNumber].id, 5)
      hand = last(game.hands)!
      playerNumber = (playerNumber + 1) % players.length
    }
    return playerNumber
  }

  it('rejects when bidding is over', () => {
    const playerNumber = completeBidding()
    expect(() => bid(game, game.players[playerNumber].id, 5)).toThrow(
      `Bid of 5 by player ${game.players[playerNumber].name} is invalid - bidding is over`
    )
  })

  it('updates hand', () => {
    const result = apply(3)
    expect(result).toEqual({
      ...game,
      timestamp: result.timestamp,
      hands: [
        {
          ...hand,
          currentPlayerNumber: (hand.currentPlayerNumber + 1) % 3,
          playerHands: hand.playerHands.map((playerHand, i) =>
            i === hand.currentPlayerNumber ? { ...playerHand, bid: 3 } : playerHand
          )
        }
      ]
    })
  })

  it('updates phase when bidding is complete', () => {
    completeBidding()

    expect(hand.phase).toBe(HandPhase.Play)
  })
})
