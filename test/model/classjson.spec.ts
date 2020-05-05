class Hand {
  foo: number

  constructor () {
    this.foo = 23
  }

  isEmpty(): boolean {
    return this.foo === 11
  }

  toString(): string {
    return String(this.foo)
  }
}

it('can json a class', () => {
  expect(JSON.stringify(new Hand())).toBe(JSON.stringify({ foo: 23 }))
})
