import { Card, PlayerHand, Suit } from './types'

export default ({ cardsInHand }: PlayerHand): Card | undefined => {
  let index = cardsInHand.length - 1
  while (index >= 0 && cardsInHand[index].suit === Suit.Diamonds) {
    index--
  }
  return index < 0 || cardsInHand[index].suit !== Suit.Clubs ? undefined : cardsInHand[index]
}
