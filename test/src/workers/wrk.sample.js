'use strict'

const { GrcHttpWrk } = require('@thrivecoin/grc-server')

class WrkSample extends GrcHttpWrk {
  helloWorld () {
    return 'hello world'
  }
}

module.exports = WrkSample
