import { Card, Player, PlayerHand, Trick } from './types'
import isEqual = require('lodash/isEqual')

export default (playerHands: ReadonlyArray<PlayerHand>,
  player: Player,
  card: Card,
  trick: Trick): ReadonlyArray<PlayerHand> =>
  playerHands.map((playerHand, i) => {
    let result = playerHand
    if (i === player.number) {
      result = {
        ...result,
        cardsInHand: result.cardsInHand.filter(_ => !isEqual(card, _)),
        cardsPlayed: [...result.cardsPlayed, card]
      }
    }
    if (trick.winner === i) {
      result = {
        ...result,
        trickCount: result.trickCount + 1
      }
    }
    return result
  })
