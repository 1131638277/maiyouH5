'use strict'
//引入webpack-merge模块
const merge = require('webpack-merge')
//引入刚才打开的prod.env.js
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
     NODE_ENV: '"development"'
})