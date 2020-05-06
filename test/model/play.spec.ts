import isEqual = require('lodash/isEqual')
import last = require('lodash/last')
import createGame from '../../src/model/createGame'
import createHand from '../../src/model/createHand'
import play from '../../src/model/play'
import { cardDisplayValue } from '../../src/model/display'
import { Card, Game, HandPhase, PlayerHand, Suit } from '../../src/model/types'

describe('play', () => {
  // let game: Game
  // let hand: Hand

  // const cards = [
  //   [
  //     {
  //       rank: 14,
  //       suit: Suit.Spades
  //     },
  //     {
  //       rank: 10,
  //       suit: Suit.Spades
  //     }
  //   ]
  // ]

  // const createGameAndCompleteBidding = (bids = [3, 4, 5]) => {
  //   let newGame = createGame()
  //   let playerNumber = last(newGame.hands)!.currentPlayerNumber
  //   for (const value of bids) {
  //     newGame = bid(newGame, newGame.players[playerNumber].id, value)
  //     playerNumber = (playerNumber + 1) % 3
  //   }
  //   return newGame
  // }
  //
  // beforeEach(() => {
  //   game = createGameAndCompleteBidding()
  //   hand = last(game.hands)!
  //   console.log(hand.phase)
  // })
  //
  // it('', () => {
  //
  // })


  describe('first trick', () => {
    const options = {
      firstToBid: 0,
      distributions: [
        [5, 5, 6, 1],
        [5, 8, 0, 4],
        [3, 0, 7, 7]
      ]
    }
    const hand = createHand(options)
    const game = createGame({
      firstHand: hand,
      bids: [3, 3, 3]
    })

    it('throws error if player attempts to play a higher club', () => {
      const player = game.players[0]
      const [playerHand] = hand.playerHands
      const expected = playerHand.cardsInHand[15]
      const card = playerHand.cardsInHand[14]

      expect(() => play(game, player.id, card)).toThrow(
        `Player ${player.name} must play ${cardDisplayValue(expected)} on the first trick`
      )
    })

    const playFirstCard = () => play(game, game.players[0].id, hand.playerHands[0].cardsInHand[15])

    it('throws error if player attempts to play a spade while out of clubs', () => {
      const afterOnePlay = playFirstCard()
      const player = game.players[1]

      expect(() => play(afterOnePlay, player.id, hand.playerHands[1].cardsInHand[0])).toThrow(
        `Player ${player.name} cannot play spades on the first trick`
      )
    })

    const playTwoCards = () => play(playFirstCard(), game.players[1].id, hand.playerHands[1].cardsInHand[12])

    it('allows discard on first trick when out of clubs', () => {
      playTwoCards()
    })

    const playFirstTrick = () => play(playTwoCards(), game.players[2].id, hand.playerHands[2].cardsInHand[9])

    it('updates winner and player when trick is complete', () => {
      const state = playFirstTrick()
      const [ trick ] = state.hands[0].tricks
      expect(trick.winner).toBeDefined()

      expect(state).toEqual({
        ...game,
        timestamp: state.timestamp,
        hands: [
          {
            ...hand,
            phase: HandPhase.Play,
            currentPlayerNumber: trick.winner,
            playerHands: hand.playerHands.map((playerHand, i) => ({
              ...playerHand,
              bid: 3,
              cardsInHand: playerHand.cardsInHand.filter(_ => !isEqual(_, trick.cards[i])),
              cardsPlayed: [trick.cards[i]],
              trickCount: i === trick.winner ? 1 : 0
            })),
            tricks: [trick]
          }
        ]
      })
    })

    const findSuitToLead = (playerHand: PlayerHand): Suit => {
      const suits = [Suit.Diamonds, Suit.Clubs, Suit.Hearts, Suit.Spades]
      for (const suit of suits) {
        if (playerHand.cardsInHand.some(_ => _.suit === suit)) {
          return suit
        }
      }
      throw new Error()
    }

    const findCard = (playerHand: PlayerHand, suit: Suit): Card => {
      let card = playerHand.cardsInHand.find(_ => _.suit === suit)
      return card || playerHand.cardsInHand[0]
    }

    const playTrick = (currentGame: Game): Game => {
      let currentHand = last(currentGame.hands)!
      const lastTrick = last(currentHand.tricks)!
      let currentPlayer = currentGame.players[lastTrick.winner!]
      const playerHand = currentHand.playerHands[currentPlayer.number]
      const suit = findSuitToLead(playerHand)
      let result = currentGame
      for (let i = 0; i < result.players.length; i++) {
        result = play(result, currentPlayer.id, findCard(currentHand.playerHands[currentPlayer.number], suit))
        currentHand = last(result.hands)!
        currentPlayer = result.players[currentHand.currentPlayerNumber]
      }
      return result
    }

    const playSubsequentTricks = (currentGame: Game) => {
      let result = currentGame
      for (let i = 0; i < 16; i++) {
        result = playTrick(result)
      }
      return result
    }

    it('completes hand after all tricks have been played', () => {
      let result = playSubsequentTricks(playFirstTrick())
      expect(result.players.every(_ => _.points !== 0)).toBe(true)
      expect(result.hands.length).toBe(2)
      expect(last(result.hands)!.phase).toBe(HandPhase.Bidding)
    })

    it('ends game when winning score is reached', () => {
      let result = playSubsequentTricks({ ...playFirstTrick(), winningScore: 10 })
      if (result.players.some(_ => _.points >= 10)) {
        // random, but should happen pretty much
        expect(result.hands.length).toBe(1)
        expect(last(result.hands)!.phase).toBe(HandPhase.Complete)
      }
    })

  })
})
