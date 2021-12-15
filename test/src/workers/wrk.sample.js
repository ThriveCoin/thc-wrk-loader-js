'use strict'

const { GrcHttpWrk } = require('@thrivecoin/grc-server')

class WrkSample extends GrcHttpWrk {
  constructor (opts) {
    super(opts)

    this.constructorOpts = opts
  }

  helloWorld () {
    return 'hello world'
  }
}

module.exports = WrkSample
