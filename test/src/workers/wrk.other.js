'use strict'

const { GrcHttpWrk } = require('@thrivecoin/grc-server')

class WrkOther extends GrcHttpWrk {
  helloWorld () {
    return 'hello world'
  }
}

module.exports = WrkOther
