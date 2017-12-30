# rss2mastodon

publish a rss feed to mastodon

## Usage

```bash
$ rss2mastodon --host https://g0v.social --url FEED_URL --token MASTODON_TOKEN [--db DB_NAME]
```

#### command line arguments

* host: mastodon instance's URL.
* url: RSS feed URL
* token: access token to the given instance
* unlisted: set the status visibility to unlisted(optional)
* db: database file name(optional)

Use [https://takahashim.github.io/mastodon-access-token/](https://takahashim.github.io/mastodon-access-token/) to find out your access token

## License

The MIT License