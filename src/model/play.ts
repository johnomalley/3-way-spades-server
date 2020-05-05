import { Card, Game, Hand, HandPhase, Player, PlayerHand, Suit, Trick } from './types'
import getCurrentPlayer from './getCurrentPlayer'
import updateCurrentHand from './updateCurrentHand'
import { cardDisplayValue } from './display'
import playFirstTrick from './playFirstTrick'
import updateTrick from './updateTrick'
import emptyTrick from './emptyTrick'
import updatePlayerHands from './updatePlayerHands'
import nextPlayerNumber from './nextPlayerNumber'
import createHand from './createHand'
import getHandScore from './getHandScore'
import last = require('lodash/last')
import initial = require('lodash/initial')
import moment = require('moment')

const validateCard = (hand: Hand, player: Player, card: Card) => {
  const cardInHand = hand.playerHands[player.number]!.cardsInHand.find(_ =>
    _.rank === card.rank && _.suit === card.suit
  )
  if (!cardInHand) {
    throw new Error(`Player '${player.name}' does not have card in hand: ${cardDisplayValue(card)}`)
  }
}

const spadesBroken = (tricks: ReadonlyArray<Trick>) =>
  tricks.some(_ => _.cards.some(_ => _.suit === Suit.Spades))

const playerMustLeadSpades = (playerHand: PlayerHand) =>
  playerHand.cardsInHand.every(_ => _.suit === Suit.Spades)

const validateLead = (player: Player, playerHand: PlayerHand, card: Card, tricks: ReadonlyArray<Trick>) => {
  if (card.suit === Suit.Spades && !spadesBroken(tricks) && !playerMustLeadSpades(playerHand)) {
    throw new Error(`Player ${player.name} may not lead spades until broken - has other cards to lead`)
  }
}

const validateFollowSuit = (player: Player, playerHand: PlayerHand, card: Card, suit: Suit) => {
  if (card.suit !== suit) {
    if (playerHand.cardsInHand.some(_ => _.suit === suit)) {
      throw new Error(`Player ${player.number} failed to follow suit: ${cardDisplayValue(card)}`)
    }
  }
}

const playSubsequentTrick = (game: Game, player: Player, card: Card): Game => {
  const hand = last(game.hands)!
  const lastTrick = last(hand.tricks)!
  const playerHand = hand.playerHands[player.number]
  if (lastTrick.winner === undefined) {
    validateFollowSuit(player, playerHand, card, lastTrick.cards[0].suit)
  } else {
    validateLead(player, playerHand, card, hand.tricks)
  }
  const trick = updateTrick(
    lastTrick.winner === undefined ? lastTrick : emptyTrick(player),
    card,
    game.players.length
  )
  const tricks = [
    ...lastTrick.winner === undefined ? initial(hand.tricks) : hand.tricks,
    trick
  ]
  return {
    ...game,
    hands: updateCurrentHand(game.hands, {
      playerHands: updatePlayerHands(hand.playerHands, player, card, trick),
      tricks,
      currentPlayerNumber: trick.winner === undefined ? nextPlayerNumber(game) : trick.winner
    })
  }
}

const isHandComplete = (hand: Hand) => hand.tricks.length === 17 && last(hand.tricks)!.winner !== undefined

const scoreHand = (game: Game, hand: Hand): Game => ({
  ...game,
  hands: [
    ...initial(game.hands),
    {
      ...hand,
      phase: HandPhase.Complete
    }
  ],
  players: game.players.map(player => ({
    ...player,
    points: player.points + getHandScore(player, hand.playerHands[player.number])
  }))
})

const isGameComplete = (game: Game) => game.players.some(_ => _.points >= game.winningScore)

const addNewHandOrEndGame = (game: Game) =>
  isGameComplete(game) ? {
    ...game,
    endTime: moment().toISOString()
  } : {
    ...game,
    hands: [
      ...game.hands,
      createHand({ firstToBid: nextPlayerNumber(game, last(game.hands)!.firstToBid) })
    ]
  }

// first play from first player
export default (game: Game, playerId: string, card: Card): Game => {
  const player = getCurrentPlayer(game, playerId)
  const hand = last(game.hands)!
  if (hand.phase !== HandPhase.Play) {
    throw new Error(`Hand is not currently in the play phase: ${hand.phase}`)
  }
  validateCard(hand, player, card)
  const lastTrick = last(hand.tricks)
  let result
  if (!lastTrick || (hand.tricks.length === 1 && lastTrick.winner === undefined)) {
    result = playFirstTrick(game, player, card)
  } else {
    result = playSubsequentTrick(game, player, card)
    const updatedHand = last(result.hands)!
    if (isHandComplete(updatedHand)) {
      result = addNewHandOrEndGame(scoreHand(result, updatedHand))
    }
  }
  return {
    ...result,
    timestamp: Date.now()
  }
}
