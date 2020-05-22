import { Game, Hand, HandPhase, Player } from './types'
import getCurrentPlayer from './getCurrentPlayer'
import updateCurrentHand from './updateCurrentHand'
import validationError from './validationError'
import last = require('lodash/last')

const isCardsVisible = (hand: Hand, player: Player): boolean => hand.playerHands[player.number].cardsVisible

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
  } else {
    const playerHands = hand.playerHands.map((playerHand, i) =>
      i === player.number ? { ...playerHand, bid, cardsVisible: true } : playerHand
    )
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
