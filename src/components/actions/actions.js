import WebTorrent from 'webtorrent'
import Clipboard from 'clipboard'
import El from 'eldo'
import selectors from 'components/selectors'
import notifier from 'components/notifier'
import './actions.css'

const wt = new WebTorrent()

const actions = (count, hasMagnet) => `
  <div id="clear-action" class="btn-action reset ${count? '' : 'disabled'}">
    <div class="action-icon no-events">
      <i class="material-icons">clear</i>
    </div>
  </div>

  <div id="share-action" class="btn-action share ${count? '' : 'disabled'}">
    <div class="webtorrent-icon no-events"></div>
  </div>

  <div id="copy-magnet-action" class="btn-action share ${hasMagnet? '' : 'disabled'}">
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

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        this.state = newState
        this.render()
      }
    })

    new Clipboard('#copy-magnet-action', {
      text: () => {
        notifier.show({message: '🔗 copied!'})
        return this.magnetUri
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
    if (!confirm('Are you sure you want to remove ALL images?')) return
    selectors.$imageList.html('')
    this.store.dispatch({type: 'CLEAR'})
  }

  share () {
    console.log('SHARE!')

    const images = this.getImages()
    const files = images.map(image => new Buffer(image.data))
    console.log('FILES', files)
    wt.seed(files, {name: 'imgest'}, (torrent) => {
      console.log('SEEDING!', torrent)
      console.log(torrent.magnetURI)
      this.magnetUri = torrent.magnetURI
      this.render()
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
    const html = actions(this.state, !!this.magnetUri)
    this.$el.html(html)
  }
}

export default Actions
