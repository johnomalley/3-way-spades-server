import { Player, Trick } from './types'

export default (leader: Player): Trick => ({
  leader: leader.number,
  cards: []
})
