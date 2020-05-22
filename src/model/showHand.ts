import { Game } from './types'
import getCurrentPlayer from './getCurrentPlayer'
import updateCurrentHand from './updateCurrentHand'
import last = require('lodash/last')
import validationError from './validationError'

export default (game: Game, playerId: string): Game => {
  const hand = last(game.hands)!
  const player = getCurrentPlayer(game, playerId)

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
