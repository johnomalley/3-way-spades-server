import { Game, Hand, HandPhase, Player } from './types'
import getCurrentPlayer from './getCurrentPlayer'
import updateCurrentHand from './updateCurrentHand'
import validationError from './validationError'
import last = require('lodash/last')
import sum = require('lodash/sum')

const isCardsVisible = (hand: Hand, player: Player): boolean => hand.playerHands[player.number].cardsVisible

const maxCountForDn = 15

const isBlindNilAllowed = ({ playerHands }: Hand): boolean =>
  sum(playerHands.map(({ bid = 0 }) => bid > 0 ? bid : 0)) <= maxCountForDn

const blindNilNotAllowedMessage = 'A bid of DN is not allowed when count is greater than '

const updatePlayerHands = (hand: Hand, player: Player, bid: number, count: number) => {
  const showAllCards = bid < 0 || bid + count > maxCountForDn
  return hand.playerHands.map((playerHand, i) => {
    if (i === player.number) {
      return {
        ...playerHand,
        bid,
        cardsVisible: true
      }
    } else if (showAllCards) {
      return {
        ...playerHand,
        cardsVisible: true
      }
    } else {
      return playerHand
    }
  })
}

export default (game: Game, playerId: string, bid: number): Game => {
  const player = getCurrentPlayer(game, playerId)
  const hand = last(game.hands)!

  const error = (message: string) =>
    validationError(`Bid of ${bid} by player ${player.name} is invalid - ${message}`)

  if (!Number.isInteger(bid)) {
    throw error('must be an integer')
  } else if (bid < -1 || bid > 17) {
    throw error('must be between -1 and 17')
  } else if (hand.phase !== HandPhase.Bidding) {
    throw error('bidding is over')
  } else if (bid === -1 && isCardsVisible(hand, player)) {
    throw error('cards have already been shown')
  } else if (bid === -1 && !isBlindNilAllowed(hand)) {
    throw error(blindNilNotAllowedMessage)
  } else {
    const count = sum(hand.playerHands.map(({ bid = 0 }) => bid > 0 ? bid : 0))
    const playerHands = updatePlayerHands(hand, player, bid, count)
    const biddingComplete = playerHands.every(_ => _.bid !== undefined)
    const phase = biddingComplete ? HandPhase.Play : HandPhase.Bidding
    const currentPlayerNumber = (hand.currentPlayerNumber + 1) % game.players.length
    return {
      ...game,
      timestamp: Date.now(),
      hands: updateCurrentHand(game.hands, { playerHands, phase, currentPlayerNumber })
    }
  }
}
