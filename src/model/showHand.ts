import { Game } from './types'
import updateCurrentHand from './updateCurrentHand'
import validationError from './validationError'
import last = require('lodash/last')

export default (game: Game, playerId: string): Game => {
  const hand = last(game.hands)!
  const player = game.players.find(_ => _.id === playerId)!

  const playerHand = hand.playerHands[player.number]
  if (playerHand.cardsVisible) {
    throw validationError(`Player ${player.name} may not show cards because cards have already been shown`)
  } else {
    return {
      ...game,
      hands: updateCurrentHand(game.hands, {
        playerHands: hand.playerHands.map((playerHand, i) =>
          i === player.number ? { ...playerHand, cardsVisible: true } : playerHand
        )
      })
    }
  }
}
