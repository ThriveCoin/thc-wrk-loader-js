'use strict'

const { GrcHttpWsWrk } = require('@thrivecoin/grc-server')

class WrkMulti extends GrcHttpWsWrk {
  constructor (opts) {
    super(opts)

    this.constructorOpts = opts
  }

  helloWorld () {
    return 'hello multiple worlds'
  }
}

module.exports = WrkMulti
