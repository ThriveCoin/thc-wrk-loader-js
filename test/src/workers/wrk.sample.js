'use strict'

const { GrcHttpWrk } = require('thc-grc-server')

class WrkSample extends GrcHttpWrk {
  helloWorld () {
    return 'hello world'
  }
}

module.exports = WrkSample
