import { Player, PlayerHand } from './types'

const getBidPoints = (bid: number) => {
  switch (bid) {
    case -1:
      return 200
    case 0:
      return 100
    default:
      return 10 * bid
  }
}

const getBagPenalty = (bags: number) => Math.floor(bags / 10) * 100

export default (player: Player, playerHand: PlayerHand): number => {
  const bid = playerHand.bid!
  const { trickCount } = playerHand
  const points = getBidPoints(bid)
  const made = bid < 1 ? trickCount === 0 : trickCount >= bid
  const bags = made && bid > 0 ? trickCount - bid : 0
  const penalty = getBagPenalty(player.points % 10 + bags)
  return made ? points + bags - penalty : -1 * points
}
