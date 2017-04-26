var FeedParser = require('feedparser')
var request = require('superagent')

var HOST = 'https://g0v.social'

function crawler (db, url, token, cb) {
  var parser = new FeedParser()
  parser.once('error', function (err) {
    console.log(err)
  })
  parser.on('readable', function () {
    var stream = this
    var item
    while (item = stream.read()) {
      lock(item, db, function (err, item) {
        if (err) return

        post(token, {status: item.title + ' ' + item.link}, function (err) {
          console.log('posted', err)
        })
      })
    }
  })
  request(url).pipe(parser)
}

function lock (item, db, cb) {
  db.get(item.guid, function (err) {
    if (err && err.notFound) {
      db.put(item.guid, '1')
      cb(null, item)
    } else {
      cb(new Error('existed'))
    }
  })
}

function post (token, msg, cb) {
  request
    .post(`${HOST}/api/v1/statuses?access_token=${token}`)
    .type('form')
    .send({status: msg.status})
    .end(function (err, res) {
      if (err) return cb(err)
    })
}

var argv = require('minimist')(process.argv.slice(2))
var level = require('level')
var db = level('./rss2mastodon.db')

crawler(db, argv.url, argv.token, function (err) {
  console.log('done')
})
