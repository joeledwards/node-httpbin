module.exports = server

function server (options = {}) {
  const logalog = require('log-a-log')

  const buzJson = require('@buzuli/json')
  const c = require('@buzuli/color')

  const bodyParser = require('body-parser')
  const express = require('express')
  const r = require('ramda')

  const {
    bindPort = 1337,
    verbose = false
  } = options

  logalog({verbose})

  const app = express()

  const summary = 'Any route (other than GET /help) will respond with the ' +
    'normal response (JSON body detailing the request). Query parameters ' +
    'are used for all behavior modification.'

  const params = {
    delay: '[number] milliseconds to delay before seding a response',
    status: '[number] HTTP status code to respond with'
  }

  app.get('/help', (req, res) => {
    res
      .json({
        summary,
        params
      })
  })

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
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

    const clientIp = headers['x-forwarded-for'] || req.ip

    let message = `${c.blue(clientIp)} => ${c.orange(method)} ${c.green(path)}${colorQuery(query)}`

    console.log(message)
    console.verbose(
      '\n' +
      message +
      `\n\n${formatHeaders(headers)}` +
      (body ? `\n\n${buzJson(body)}` : '')
    )

    const status = Number(query.status) || 200
    const delay = Number(query.delay) || 0

    const respond = () => {
      res
        .append('x-client-ip', clientIp)
        .status(status)
        .json({
          method,
          path,
          headers,
          query,
          body
        })
    }

    if (delay > 0) {
      setTimeout(respond, delay)
    } else {
      respond()
    }
  })

  app.listen(bindPort, () => {
    console.verbose(`Verbose output enabled`)
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
