import createGameId from '../../src/model/createGameId'

describe('encodes current date', () => {
  it('uses year month date hour', () => {
    expect(createGameId(1588724510938).slice(0, 10)).toBe('2020050519')
  })
})
