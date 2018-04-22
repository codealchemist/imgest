class UrlShortener {
  constructor() {
    let key = 'AIzaSyBdRrBWIxRcM001vw3uYM4rQ8R-SqUXHug'
    this.serviceUrl = `https://www.googleapis.com/urlshortener/v1/url?fields=id&key=${key}`
    this.baseUrl = `${location.protocol}//${location.host}`
    this.shortBaseUrl = 'https://goo.gl/'
    this.promise = null
    this.url = null
  }

  redirect (hash) {
    location.href = `${this.shortBaseUrl}${hash}`
  }

  create(magnet) {
    this.url = `${this.baseUrl}#${magnet}`
    return this
  }

  shorten(url) {
    url = url || this.url
    let payload = JSON.stringify({
      longUrl: url
    })

    this.promise = fetch(this.serviceUrl, {
      method: 'POST',
      body: payload,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })

    this.promise.then(
      (response) => this.onShortenOk(response),
      (error) => this.onShortenError(error)
    )

    return this
  }

  set(url) {
    history.pushState({}, document.title, url)
    return this
  }

  onShortenOk(response) {
    response
      .json()
      .then((data) => {
        let shortId = data.id.replace(this.shortBaseUrl, '') // remove shortener service base url
        let newUrl = `${this.baseUrl}#${shortId}`

        if (typeof this.onDoneCallback === 'function') {
          this.onDoneCallback(newUrl)
        }
      })
  }

  onShortenError(response) {
    if (typeof this.onErrorCallback === 'function') {
      this.onErrorCallback(response)
    }
  }

  getPromise() {
    return this.promise
  }

  onDone (callback) {
    this.onDoneCallback = callback
  }

  onError (callback) {
    this.onErrorCallback = callback
  }
}

const urlShortener = new UrlShortener()
export default urlShortener
