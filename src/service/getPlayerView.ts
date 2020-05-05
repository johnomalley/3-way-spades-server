import last = require('lodash/last')
import { Card, Game, Trick } from '../model/types'

export type PlayerView = Readonly<{
  startTime: string
  endTime?: string
  timestamp: number
  playerNumber: number
  currentPlayerNumber: number
  players: ReadonlyArray<{
    name: string
    points: number
    bid?: number
    trickCount: number
  }>
  cardsInHand: ReadonlyArray<Card>
  cardsPlayed: ReadonlyArray<Card>
  lastTrick?: Trick
  currentTrick?: Trick
}>

export default (game: Game, playerId: string): PlayerView => {
  const player = game.players.find(_ => _.id === playerId)!
  const {  currentPlayerNumber, playerHands, tricks } = last(game.hands)!
  const { cardsInHand, cardsPlayed } = playerHands[player.number]
  const [ currentTrick, lastTrick ] = tricks.slice(Math.max(0, tricks.length - 2)).reverse()
  return {
    startTime: game.startTime,
    endTime: game.endTime,
    timestamp: game.timestamp,
    playerNumber: player.number,
    currentPlayerNumber,
    players: game.players.map(({ name, number, points }) => ({
      name,
      points,
      bid: playerHands[number].bid,
      trickCount: playerHands[number].trickCount
    })),
    cardsInHand,
    cardsPlayed,
    ...(currentTrick ? { currentTrick } : {}),
    ...(lastTrick ? { lastTrick } : {})
  }
}
