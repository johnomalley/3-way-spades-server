import { Player, PlayerHand } from '../../src/model/types'
import getHandScore from '../../src/model/getHandScore'

describe('getHandScore', () => {
  let player: Player
  let playerHand: PlayerHand

  beforeEach(() => {
    player = {
      id: 'X',
      number: 0,
      name: 'Test',
      points: 0,
      pointsPerHand: []
    }
    playerHand = {
      bid: 3,
      trickCount: 5,
      cardsVisible: false,
      cardsInHand: [],
      cardsPlayed: []
    }
  })

  const apply = () => getHandScore(player, playerHand)

  it('scores 10 * bid + bags when made', () => {
    expect(apply()).toBe(32)
  })

  it('scores -200 for missing blind nil', () => {
    playerHand = {
      ...playerHand,
      bid: -1,
      trickCount: 1
    }

    expect(apply()).toBe(-300)
  })

  it('scores -100 for missing nil', () => {
    playerHand = {
      ...playerHand,
      bid: 0,
      trickCount: 5
    }

    expect(apply()).toBe(-150)
  })

  it('applies double penalty for double bagging out', () => {
    playerHand = {
      ...playerHand,
      bid: 1,
      trickCount: 12
    }
    player = {
      ...player,
      points: 9
    }

    expect(apply()).toBe(21 - 200)
  })

  it('applies penalty for bagging', () => {
      playerHand = {
        ...playerHand,
        bid: 5,
        trickCount: 8
      }
      player = {
        ...player,
        points: 7
      }

      expect(apply()).toBe(53 - 100)
  })

  it('is negative when going down', () => {
    playerHand = {
      ...playerHand,
      bid: 6,
      trickCount: 5
    }

    expect(apply()).toBe(-60)
  })
})
