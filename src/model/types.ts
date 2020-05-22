export enum Suit {
  Diamonds = 0,
  Clubs = 1,
  Hearts = 2,
  Spades = 3
}

export type Card = Readonly<{
  rank: number
  suit: Suit
}>

export type Trick = Readonly<{
  leader: number
  winner?: number
  cards: ReadonlyArray<Card>
}>

export type PlayerHand = Readonly<{
  bid?: number
  trickCount: number
  cardsVisible: boolean
  cardsInHand: ReadonlyArray<Card>
  cardsPlayed: ReadonlyArray<Card>
}>

export type BasePlayer = Readonly<{
  id: string
  name: string
}>

export type Player = BasePlayer & Readonly<{
  number: number
  points: number
  pointsPerHand: ReadonlyArray<number>
}>

export enum HandPhase {
  Bidding = 0,
  Play = 1,
  Complete = 2
}

export type Hand = Readonly<{
  firstToBid: number
  currentPlayerNumber: number
  phase: HandPhase
  deck: ReadonlyArray<Card>
  playerHands: ReadonlyArray<PlayerHand>
  tricks: ReadonlyArray<Trick>
}>

export type BaseGame = Readonly<{
  id: string
  startTime: string
  endTime?: string
  timestamp: number
  winningScore: number
  players: ReadonlyArray<Player>
  handCount: number
}>

export type Game = BaseGame & Readonly<{
  hands: ReadonlyArray<Hand>
}>

export type Distributions = ReadonlyArray<ReadonlyArray<number>>

export type ValidationError = Error & Readonly<{ statusCode?: number }>
