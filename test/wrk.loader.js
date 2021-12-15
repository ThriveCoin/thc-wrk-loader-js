'use strict'

/* eslint-env mocha */

const assert = require('assert')
const sinon = require('sinon')
const { wrkLoader } = require('..')
const WrkSample = require('./src/workers/wrk.sample')
const WrkOther = require('./src/workers/wrk.other')

describe('wrkLoader tests', () => {
  const validArgv = ['node', 'index.js', '--worker=wrk.sample', '--env=development', '--port=7070']
  const processArgvStub = sinon.stub(process, 'argv')

  beforeEach(() => {
    processArgvStub.value(validArgv)
  })

  after(() => {
    processArgvStub.restore()
  })

  it('should load worker from expected dir', () => {
    const wrk = wrkLoader(__dirname)
    assert.ok(wrk instanceof WrkSample)
  })

  it('should load common conf from env when file exists', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=test', '--port=7070'])
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.confEnv, 'test')
  })

  it('should load common conf from default file when file does not exist exists', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=production', '--port=7070'])
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.confEnv, 'default')
  })

  it('should load wrk conf from env when file exists', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=test', '--port=7070'])
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.greeter, 'test')
  })

  it('should load wrk conf from default file when file does not exist exists', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=production', '--port=7070'])
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.greeter, 'default')
  })

  it('should load wrk conf from default file when file does not exist exists', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=production', '--port=7070'])
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.greeter, 'default')
  })

  it('wrk conf can overide common conf', () => {
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.debug, true)
  })

  it('service name should not be included in conf', () => {
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.serviceName, undefined)
  })

  it('grape should be included in conf', () => {
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._conf.grape, 'http://127.0.0.1:30001')
  })

  it('port, name, env should be set correctly', () => {
    const wrk = wrkLoader(__dirname)
    assert.strictEqual(wrk._port, 7070)
    assert.strictEqual(wrk._name, 'http:wrk:sample')
    assert.strictEqual(wrk._env, 'development')
  })

  it('should fail when common conf does not exist', () => {
    assert.throws(() => {
      wrkLoader('foo')
    }, (err) => {
      assert.strictEqual(err.message, 'ERR_COMMON_CONF_MISSING')
      return true
    })
  })

  it('should not fail when common conf does not exist', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.other', '--env=test', '--port=7070', '--service-name=http:wrk:other'])

    const wrk = wrkLoader(__dirname)
    assert.ok(wrk instanceof WrkOther)
    assert.strictEqual(wrk._name, 'http:wrk:other')
  })

  it('should fail when worker does not exist', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample-2', '--env=production', '--port=7070'])

    assert.throws(() => {
      wrkLoader(__dirname)
    }, (err) => {
      assert.strictEqual(err.message, 'ERR_WRK_NOT_FOUND')
      return true
    })
  })

  it('should not fail when serviceName is missing', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=staging', '--port=7070'])

    assert.doesNotThrow(() => {
      wrkLoader(__dirname)
    })
  })

  it('should support additonal yargs arguments via function', () => {
    processArgvStub.value(['node', 'index.js', '--worker=wrk.sample', '--env=test', '--port=7070', '--foo'])

    wrkLoader(__dirname, (y) => y.option('foo', { demandOption: true }))
  })
})
