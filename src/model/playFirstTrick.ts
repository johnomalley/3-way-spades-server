import { Card, Game, Player, PlayerHand, Suit } from './types'
import getSmallestClub from './getSmallestClub'
import { cardDisplayValue } from './display'
import updateTrick from './updateTrick'
import updateCurrentHand from './updateCurrentHand'
import updatePlayerHands from './updatePlayerHands'
import nextPlayerNumber from './nextPlayerNumber'
import emptyTrick from './emptyTrick'
import validationError from './validationError'
import isEqual = require('lodash/isEqual')
import last = require('lodash/last')

const validate = (player: Player, playerHand: PlayerHand, card: Card) => {
  const smallestClub = getSmallestClub(playerHand)
  if (smallestClub && !isEqual(smallestClub, card)) {
    throw validationError(`Player ${player.name} must play ${cardDisplayValue(smallestClub)} on the first trick`)
  } else if (card.suit === Suit.Spades) {
    throw validationError(`Player ${player.name} cannot play spades on the first trick!`)
  }
}

export default (game: Game, player: Player, card: Card): Game => {
  const hand = last(game.hands)!
  const playerHand = hand.playerHands[player.number]
  validate(player, playerHand, card)
  const lastTrick = last(hand.tricks)
  const trick = updateTrick(lastTrick || emptyTrick(player), card, game.players.length, Suit.Clubs)
  return {
    ...game,
    hands: updateCurrentHand(game.hands, {
      playerHands: updatePlayerHands(hand.playerHands, player, card, trick),
      tricks: [trick],
      currentPlayerNumber: trick.winner === undefined ? nextPlayerNumber(game) : trick.winner
    })
  }
}
