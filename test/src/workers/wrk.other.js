'use strict'

const { GrcHttpWrk } = require('thc-grc-server')

class WrkOther extends GrcHttpWrk {
  helloWorld () {
    return 'hello world'
  }
}

module.exports = WrkOther
