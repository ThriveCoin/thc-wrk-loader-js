'use strict'

const _omit = require('lodash/omit')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const resolveConfig = require('./resolve.config')

const defaultOpts = [
  '_', '$0', 'worker', 'w', 'port', 'p', 'env', 'e',
  'announce', 'timeout', 'service-name'
]

/**
 *
 * @param {string} ctxDir
 * @param {(y: yargs) => yargs} [argvFunc]
 * @returns {any}
 */
const wrkLoader = (ctxDir, argvFunc = null) => {
  const defaultCliArgs = yargs(hideBin(process.argv))
    .option('worker', {
      alias: 'w',
      type: 'string',
      desc: 'worker that will be running, should be a file from src/workers/ without js extension',
      demandOption: true
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      desc: 'optional worker port, required only for workers that serve as grc servers'
    })
    .option('env', {
      alias: 'e',
      type: 'string',
      desc: 'environment',
      choices: ['production', 'development', 'staging', 'test'],
      demandOption: true
    })
    .option('announce', {
      type: 'number',
      desc: 'grc announce interval',
      default: 15000
    })
    .option('timeout', {
      type: 'number',
      desc: 'grc call timeout',
      default: 30000
    })
    .option('service-name', {
      type: 'string',
      desc: 'optional service name, required for grc server workers, if provided will override config value'
    })
    .help()
    .usage('$ index.js --worker=wrk.sample --env=development --port=7070')

  const argv = (argvFunc ? argvFunc(defaultCliArgs) : defaultCliArgs).parse()
  const confDir = path.join(ctxDir, 'config')
  const wrkDir = path.join(ctxDir, 'src', 'workers')

  const commonConfPath = resolveConfig(confDir, 'common.json', argv.env)
  if (!fs.existsSync(commonConfPath)) throw new Error('ERR_COMMON_CONF_MISSING')

  const wrkConfPath = resolveConfig(confDir, `${argv.worker}.json`, argv.env)

  const wrkPath = path.join(wrkDir, argv.worker)
  if (!fs.existsSync(`${wrkPath}.js`)) throw new Error('ERR_WRK_NOT_FOUND')

  const conf = require(commonConfPath)
  if (fs.existsSync(wrkConfPath)) {
    Object.assign(conf, require(wrkConfPath))
  }

  const wrkServiceName = argv['service-name'] || conf.serviceName
  delete conf.serviceName

  const CLASS = require(wrkPath)

  const wrk = new CLASS({
    ..._omit(argv, defaultOpts),
    name: wrkServiceName,
    port: argv.port,
    grape: conf.grape,
    timeout: argv.timeout,
    announce: argv.announce,
    conf,
    env: argv.env
  })

  return wrk
}

module.exports = wrkLoader
