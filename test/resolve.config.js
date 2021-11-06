'use strict'

/* eslint-env mocha */

const assert = require('assert')
const path = require('path')
const { resolveConfig } = require('..')

describe('resolveConfig tests', () => {
  const confDir = path.join(__dirname, 'config')

  it('should return env specific config when it exists', () => {
    const confPath = resolveConfig(confDir, 'common.json', 'test')
    assert.strictEqual(confPath, path.join(confDir, 'test.common.json'))
  })

  it('should fall back to default config when env config does not exist', () => {
    const confPath = resolveConfig(confDir, 'common.json', 'production')
    assert.strictEqual(confPath, path.join(confDir, 'common.json'))
  })

  it('should return null when neither config file exists', () => {
    const confPath = resolveConfig(confDir, 'conf.json', 'production')
    assert.strictEqual(confPath, null)
  })
})
