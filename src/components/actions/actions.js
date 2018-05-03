import WebTorrent from 'webtorrent'
import Clipboard from 'clipboard'
import El from 'eldo'
import selectors from 'components/selectors'
import notifier from 'components/notifier'
import urlShortener from 'components/url-shortener'
import loading from 'components/loading'
import './actions.css'

const wt = new WebTorrent()

const actions = ({count, hasMagnet, isCreatingMagnet}) => `
  <div id="clear-action" class="btn-action reset ${count ? '' : 'disabled'}">
    <div class="action-icon no-events">
      <i class="material-icons">clear</i>
    </div>
  </div>

  <div id="share-action" class="btn-action share ${(count && !isCreatingMagnet) ? '' : 'disabled'}">
    <div class="webtorrent-icon no-events"></div>
  </div>

  <div id="copy-magnet-action" class="btn-action share ${hasMagnet ? '' : 'disabled'}">
    <div class="action-icon no-events">
      <i class="material-icons">link</i>
    </div>
  </div>
`

class Actions {
  constructor (store) {
    this.store = store
    this.state = this.getState()
    this.magnetUri = null
    this.shortUrl = null
    this.isCreatingMagnet = false

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        this.state = newState
        this.render()
      }
    })

    // eslint-disable-next-line
    new Clipboard('#copy-magnet-action', {
      text: () => {
        notifier.show({message: '🔗 copied!'})
        return this.shortUrl
      }
    })
  }

  getState () {
    return this.store.getState().count
  }

  getImages () {
    return this.store.getState().images
  }

  clear () {
    if (!this.state) return
    if (!window.confirm('Are you sure you want to remove ALL images?')) return
    selectors.$imageList.html('')
    this.store.dispatch({type: 'CLEAR'})
  }

  share () {
    this.isCreatingMagnet = true
    loading.torrent().show()
    this.render()

    const images = this.getImages()
    const files = images.map(image => new Buffer(image.data))
    const ts = (new Date()).getTime()
    const name = `imgest-${ts}`
    wt.seed(files, {name}, (torrent) => {
      console.log(torrent.magnetURI)
      this.magnetUri = torrent.magnetURI

      urlShortener
        .create(this.magnetUri)
        .shorten()
        .onDone((shortUrl) => {
          this.shortUrl = shortUrl
          this.isCreatingMagnet = false
          this.render()
          loading.torrent().hide()
        })
    })
  }

  events () {
    this.$el.on('click', (e) => {
      if (e.target.id === 'clear-action') return this.clear()
      if (e.target.id === 'share-action') return this.share()
    })
  }

  mount (el) {
    this.$el = new El(el)
    this.events()
    return this
  }

  render () {
    const html = actions({
      count: this.state,
      hasMagnet: !!this.shortUrl,
      isCreatingMagnet: this.isCreatingMagnet
    })
    this.$el.html(html)
  }
}

export default Actions
