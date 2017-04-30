#! /usr/bin/env node
var FeedParser = require('feedparser')
var request = require('superagent')
var async = require('async')

function crawler (host, db, url, token, cb) {
  var parser = new FeedParser()
  var tasks = []
  parser.once('error', function (err) {
    console.log(err)
  })
  parser.on('readable', function () {
    var stream = this
    var item
    while (item = stream.read()) {
      tasks.push(postTask(db, host, token, item))
    }
  })
  parser.on('end', function () {
    async.series(tasks, function (err) {
      if (err) throw err

      cb()
    })
  })
  request(url).pipe(parser)
}

function postTask (db, host, token, item) {
  return cb => {
    db.get(item.guid, function (err) {
      if (err && err.notFound) {
        db.put(item.guid, '1')
        post()
      } else {
        cb()
      }
    })

    function post () {
      request
      .post(`${host}/api/v1/statuses`)
      .query({access_token: token})
      .type('form')
      .send({status: [item.title, item.summary, item.link].join('\n')})
      .end(function (err, res) {
        if (err) return cb(err)
      })
    }
  }
}

var argv = require('minimist')(process.argv.slice(2))
var level = require('level')
var db = level('./rss2mastodon.db')

crawler(argv.host, db, argv.url, argv.token, function (err) {
  if (err) throw err
})
