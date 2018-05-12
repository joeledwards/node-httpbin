module.exports = server

function server (options = {}) {
  require('log-a-log')()

  const buzJson = require('@buzuli/json')
  const c = require('@buzuli/color')

  const bodyParser = require('body-parser')
  const express = require('express')
  const r = require('ramda')

  const {
    bindPort = 1337,
    verbose = false
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

    let message = `${c.orange(method)} ${c.green(path)}${colorQuery(query)}`

    if (verbose) {
      message += `\n\n${formatHeaders(headers)}` 
      message += body ? `\n\n${buzJson(body)}` : ''
    }

    console.log(message)

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

  function colorQuery (queryString) {
    const qs = r.compose(
      r.join('&'),
      r.map(([k, v]) => `${c.yellow(k)}=${c.blue(v)}`),
      r.toPairs
    )(queryString || {})
    return qs ? ('?' + qs) : ''
  }

  function formatHeaders (headers) {
    const maxHeaderLength = r.compose(
      r.reduce(r.max, 0),
      r.map(h => h.length),
      r.keys
    )(headers)

    return r.compose(
      r.join('\n'),
      r.map(([name, value]) => {
        const pad = ' '.repeat(maxHeaderLength - name.length)
        return `${pad}${c.yellow(name)} : ${c.blue(value)}`
      }),
      r.sortBy(([k, v]) => k),
      r.toPairs
    )(headers)
  }
}
