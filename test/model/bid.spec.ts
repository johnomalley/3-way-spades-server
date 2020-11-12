import createGame from '../../src/model/createGame'
import { Game, Hand, HandPhase } from '../../src/model/types'
import bid from '../../src/model/bid'
import showHand from '../../src/model/showHand'
import last = require('lodash/last')

describe('bid', () => {
  let game: Game
  let hand: Hand
  let playerId: string

  const updateHandAndPlayerId = () => {
    hand = last(game.hands)!
    playerId = game.players[hand.currentPlayerNumber].id
  }

  beforeEach(() => {
    game = createGame()
    updateHandAndPlayerId()
  })

  const showPlayerHand = (): Game => {
    if (!hand.playerHands[hand.currentPlayerNumber].cardsVisible) {
      game = showHand(game, playerId)
      updateHandAndPlayerId()
    }
    return game
  }

  const apply = (value: number) => {
    game = bid(value === -1 ? game : showPlayerHand(), playerId, value)
    updateHandAndPlayerId()
    return game
  }

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

  it('rejects bid of -1 when player hand has been shown', () => {
    game = showHand(game, playerId)
    expect(() => bid(game, playerId, -1)).toThrow(
      `Bid of -1 by player ${game.players[hand.currentPlayerNumber].name} is invalid - cards have already been shown`
    )
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
    const { currentPlayerNumber, playerHands } = hand
    const result = apply(3)
    expect(result).toEqual({
      ...game,
      timestamp: result.timestamp,
      hands: [
        {
          ...hand,
          currentPlayerNumber: (currentPlayerNumber + 1) % 3,
          playerHands: playerHands.map((playerHand, i) =>
            i === currentPlayerNumber ? { ...playerHand, bid: 3, cardsVisible: true } : playerHand
          )
        }
      ]
    })
  })

  it('updates phase when bidding is complete', () => {
    completeBidding()

    expect(hand.phase).toBe(HandPhase.Play)
  })

  describe('double nil', () => {
    it('rejects bid of DN when player hand has been shown', () => {
      showPlayerHand()
      expect(() => bid(game, playerId, -1)).toThrow(
        `Bid of -1 by player ${game.players[hand.currentPlayerNumber].name} is invalid - cards have already been shown`
      )
    })

    it('makes all cards visible', () => {
      apply(-1)
      expect(hand.playerHands.every(_ => _.cardsVisible)).toBe(true)
    })

    it('is not enabled - all cards become visible - when count is > 15', () => {
      apply(8)
      apply(8)

      expect(hand.playerHands.every(_ => _.cardsVisible)).toBe(true)
    })
  })
})
