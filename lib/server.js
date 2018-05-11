module.exports = server

function server (options = {}) {
  require('log-a-log')()

  const buzJson = require('@buzuli/json')
  const c = require('@buzuli/color')

  const bodyParser = require('body-parser')
  const express = require('express')
  const r = require('ramda')

  const {
    bindPort = 1337
  } = options

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.text())
  app.use(bodyParser.raw())

  app.use((req, res) => {
    const {
      method,
      path,
      headers,
      query,
      body
    } = req

    console.log(`${c.green(method)} ${c.blue(path)}`)

    res.json({
      method,
      path,
      headers,
      query,
      body
    })
  })

  app.listen(bindPort, () => {
    console.info(`Listening on port ${c.orange(bindPort)} ...`)
  })
}
