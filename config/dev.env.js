'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://vocationaledu.openteacher.net"',
  API_PXLogin: '"http://passport.openteacher.net"',
  API_IMG: '"http://vocationaledu.openteacher.net"'
})
