import { Card, Game, HandPhase, Player, Trick } from '../model/types'
import last = require('lodash/last')

export type PlayerView = Readonly<{
  gameId: string
  startTime: string
  endTime?: string
  timestamp: number
  playerNumber: number
  phase: HandPhase
  currentPlayerNumber: number
  players: ReadonlyArray<{
    name: string
    points: number
    pointsPerHand: ReadonlyArray<number>
    bid?: number
    trickCount: number
  }>
  cardsVisible: boolean
  cardsInHand: ReadonlyArray<Card>
  cardsPlayed: ReadonlyArray<Card>
  tricks: ReadonlyArray<Trick>
}>

export default (game: Game, playerId: string): PlayerView => {
  const player = game.players.find(_ => _.id === playerId)!
  const { currentPlayerNumber, playerHands, tricks, phase } = last(game.hands)!
  const { cardsInHand, cardsPlayed, cardsVisible } = playerHands[player.number]
  const { endTime } = game

  const toPlayerViewPlayer = ({ name, number, points, pointsPerHand }: Player) => {
    const { bid, trickCount } = playerHands[number]
    return {
      name,
      points,
      pointsPerHand,
      ...(bid === undefined ? {} : { bid }),
      trickCount
    }
  }

  return {
    gameId: game.id,
    startTime: game.startTime,
    ...(endTime ? { endTime } : {}),
    timestamp: game.timestamp,
    playerNumber: player.number,
    phase,
    currentPlayerNumber,
    players: game.players.map(toPlayerViewPlayer),
    cardsVisible,
    cardsInHand: cardsVisible ? cardsInHand : [],
    cardsPlayed,
    tricks
  }
}
