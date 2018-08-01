#!/usr/bin/env node
require('../lib/server')(
  require('yargs')
  .env('HTTPBIN')
  .option('bind-port', {
    type: 'number',
    desc: 'TCP port on which the server should listen',
    default: 1337,
    alias: ['p']
  })
  .option('verbose', {
    type: 'boolean',
    desc: 'log detailed info for each request',
    default: false,
    alias: ['v']
  })
  .argv
)
