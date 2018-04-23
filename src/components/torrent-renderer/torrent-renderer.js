import {createStore} from 'redux'
import reducer from 'state/reducer'
import El from 'eldo'
import sortable from 'sortablejs'
import torrentLoader from 'components/torrent-loader'
import image from 'components/torrent-image'
import loading from 'components/loading'
import ImageEditor from '../image-editor/image-editor'
import initialState from 'state/initial.json'
import 'components/image-list/image-list.css'

const imageList = (images = []) => (
  images
    .map((imageState, index) => image({...imageState, index}))
    .join('')
)

class TorrentRenderer {
  constructor () {
    this.store = createStore(reducer, initialState)
    this.editor = new ImageEditor(this.store)
  }

  mount (el) {
    this.$el = new El(el)
    this.totalFiles = 0
    this.loadedFiles = 0
    this.editor.mount('#image-editor-container')
    return this
  }

  render (torrent) {
    this.state = {}
    this.totalFiles = torrent.files.length
    torrent.files.forEach((file) => {
      file.id = file.offset
      file.description = ''
      this.state[file.id] = {
        file,
        name: '',
        description: '',
        type: 'image/jpeg', // TODO: set from file
        data: null
      }

      file.getBuffer((err, buffer) => {
        const image = new El(`#image-${file.id} .image-element`)
        image.style('background-image', `url('data:image/jpeg;${buffer}`)
        ++this.loadedFiles

        // Add file to local state.
        this.state[file.id].data = buffer

        if (
          this.loadedFiles === this.totalFiles
          && typeof this.onDoneCallback === 'function'
        ) {
          this.onDoneCallback()
        }
      })
    })

    const html = imageList(torrent.files)
    this.$el.html(html)

    // Create sortable images list.
    sortable.create(this.$el.get())

    this.editor.render()
    this.events()

    if (typeof this.onLoadingCallback === 'function') {
      this.onLoadingCallback()
    }
  }

  onLoading (callback) {
    this.onLoadingCallback = callback
    return this
  }

  onDone (callback) {
    this.onDoneCallback = callback
    return this
  }

  events () {
    this.$el.on('click', (e) => {
      e.stopPropagation()
      if (e.target.className.match(/^view.*$/)) this.view(e, e.target.dataset)
    })
  }

  view (e, {id}) {
    const image = this.state[id]

    this.store.dispatch({
      type: 'OPEN_IMAGE_EDITOR',
      image: { ...image },
      readOnly: true
    })
  }
}

export default TorrentRenderer
