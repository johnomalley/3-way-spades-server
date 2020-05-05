import isEqual = require('lodash/isEqual')
import createGame from '../../src/model/createGame'
import db from '../../src/service/db'

describe('db', () => {
  describe('live insert and update', () => {
    it('inserts, gets, and deletes', async () => {
      require('../../configureRegion')
      const game = createGame()
      await db.put(game)
      const copy = await db.get(game.id)
      expect(isEqual(game, copy)).toBe(true)
      await db.del(game.id)
      const x = await db.get(game.id)
      console.log(JSON.stringify(x))
    })
  })
})
