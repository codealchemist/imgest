import WebTorrent from 'webtorrent'
import urlShortener from 'components/url-shortener'

class TorrentLoader {
  constructor () {
    this.wt = new WebTorrent()
    this.loading = false
    this.torrent = null
    this.maxDownloadSpeed = 0
    this.peers = 0
  }

  load (magnet) {
    this.loading = true
    this.wt.add(magnet, (torrent) => {
      this.torrent = torrent

      if (typeof this.onTorrentCallback === 'function') {
        this.onTorrentCallback(torrent)
      }
    })

    this.wt.on('error', (err) => {
      console.log('ERR', err)
      if (typeof this.onErrorCallback === 'function') {
        this.onErrorCallback(err)
      }
    })

    this.monitorDownload()
    this.checkDownload()
  }

  monitorDownload () {
    const monitorInterval = 2 // seconds

    this.interval = setInterval(() => {
      const { downloadSpeed } = this.wt
      if (downloadSpeed > this.maxDownloadSpeed) {
        this.maxDownloadSpeed = downloadSpeed
      }

      if (!this.torrent) return
      this.peers = this.torrent.numPeers
    }, monitorInterval * 1000)
  }

  checkDownload () {
    const checkDelay = 15 // seconds.
    setTimeout(() => {
      if (this.maxDownloadSpeed === 0 && this.peers === 0) {
        const err = 'ERROR: There are no peers for this torrent.'
        if (typeof this.onErrorCallback === 'function') {
          this.onErrorCallback(err)
        }
        clearInterval(this.interval)
      }
    }, checkDelay * 1000)
  }

  autoload () {
    const hash = window.location.hash.substr(1)
    if (!hash) return

    // Autoload magnet link.
    if (this.isMagnetLink(hash)) {
      this.load(hash)
      return
    }

    // Autoload magnet using short url.
    this.loading = true
    urlShortener.redirect(hash)
  }

  isMagnetLink (value) {
    return value.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null
  }

  onTorrent (callback) {
    this.onTorrentCallback = callback
    return this
  }

  onError (callback) {
    this.onErrorCallback = callback
  }
}

const torrentLoader = new TorrentLoader()
export default torrentLoader
