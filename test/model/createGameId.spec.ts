import createGameId from '../../src/model/createGameId'

describe('encodes current date', () => {
  it('encodes year month date hour', () => {
    expect(createGameId(1588724510938).slice(0, 7)).toBe('2020EET')
  })

  it('encodes date with digit if needed', () => {
    expect(createGameId(1590798356020).slice(0, 7)).toBe('2020E2T')
  })
})
