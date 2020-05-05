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
  cardsInHand: ReadonlyArray<Card>
  cardsPlayed: ReadonlyArray<Card>
}>

export type Player = Readonly<{
  id: string
  number: number
  name: string
  points: number
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

export type Game = Readonly<{
  id: string
  winningScore: number
  players: ReadonlyArray<Player>
  hands: ReadonlyArray<Hand>
}>

export type Distributions = ReadonlyArray<ReadonlyArray<number>>
