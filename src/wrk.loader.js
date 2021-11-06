'use strict'

const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

/**
 * 
 * @param {string} ctxDir 
 * @param {(y: yargs) => yargs} [argvFunc] 
 * @returns 
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
      desc: 'worker port',
      demandOption: true
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
      desc: 'optional service name, if provided will override config value'
    })
    .help()
    .usage('$ index.js --worker=wrk.sample --env=development --port=7070')

  const argv = (argvFunc ? argvFunc(defaultCliArgs) : defaultCliArgs).parse()
  const confDir = path.join(ctxDir, 'config')
  const wrkDir = path.join(ctxDir, 'src', 'workers')

  let commonConfPath = path.join(confDir, `${argv.env}.common.json`)
  if (!fs.existsSync(commonConfPath)) commonConfPath = path.join(confDir, 'common.json')
  if (!fs.existsSync(commonConfPath)) throw new Error('ERR_COMMON_CONF_MISSING')

  let wrkConfPath = path.join(confDir, `${argv.env}.${argv.worker}.json`)
  if (!fs.existsSync(wrkConfPath)) wrkConfPath = path.join(confDir, `${argv.worker}.json`)

  const wrkPath = path.join(wrkDir, argv.worker)
  if (!fs.existsSync(`${wrkPath}.js`)) throw new Error('ERR_WRK_NOT_FOUND')

  const conf = require(commonConfPath)
  if (fs.existsSync(wrkConfPath)) {
    Object.assign(conf, require(wrkConfPath))
  }

  const wrkServiceName = argv['service-name'] || conf.serviceName
  if (!wrkServiceName) throw new Error('ERR_WRK_SERVICE_NAME_MISSING')
  delete conf.serviceName

  const CLASS = require(wrkPath)

  const wrk = new CLASS({
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
