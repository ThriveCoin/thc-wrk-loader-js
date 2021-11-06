'use strict'

const fs = require('fs')
const path = require('path')

/**
 * @param {string} confDir
 * @param {string} file
 * @param {string} env
 *
 * @returns {string}
 */
const resolveConfig = (confDir, file, env) => {
  let confPath = path.join(confDir, `${env}.${file}`)
  if (!fs.existsSync(confPath)) confPath = path.join(confDir, file)
  if (!fs.existsSync(confPath)) return null

  return confPath
}

module.exports = resolveConfig
