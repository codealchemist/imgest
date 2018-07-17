import {createStore} from 'redux'
import reducer from 'state/reducer'
import El from 'eldo'
import sortable from 'sortablejs'
import image from 'components/torrent-image'
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
        if (err) throw err
        const image = new El(`#image-${file.id} .image-element`)
        image.style('background-image', `url('data:image/jpeg;${buffer}`)
        ++this.loadedFiles

        // Add file to local state.
        this.state[file.id].data = buffer

        if (
          this.loadedFiles === this.totalFiles &&
          typeof this.onDoneCallback === 'function'
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
      if (e.target.className.match(/^download.*$/)) this.download(e, e.target.dataset)
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

  download (e, {id}) {
    const image = this.state[id]
    // console.log('image', image)

    // TODO: move to helper
    const typesMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif'
    }
    const ext = typesMap[image.type] || 'data'

    // TODO: save image data without `data:...` prefix on torrent creation.
    // This will allow to avoid converting back to str and work directly with the
    // Uint8Array. Affects rendering too.
    function arrayBufferToString (buf, callback) {
      var bb = new Blob([new Uint8Array(buf)]) // eslint-disable-line no-undef
      var f = new FileReader() // eslint-disable-line no-undef
      f.onload = e => callback(e.target.result)
      f.readAsText(bb)
    }

    arrayBufferToString(image.data, (src) => {
      const data = atob(src.split(',')[1]) // eslint-disable-line no-undef

      // Use typed arrays to convert the binary data to a Blob
      var arraybuffer = new ArrayBuffer(data.length)
      var view = new Uint8Array(arraybuffer)
      for (let i = 0; i < data.length; i++) {
        view[i] = data.charCodeAt(i) & 0xff
      }

      let blob
      try {
        blob = new Blob([arraybuffer], {type: 'application/octet-stream'}) // eslint-disable-line no-undef
      } catch (e) {
        // Support older browsers.
        const bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)()
        bb.append(arraybuffer)
        blob = bb.getBlob('application/octet-stream')
      }

      // Use the URL object to create a temporary URL.
      const url = (window.webkitURL || window.URL).createObjectURL(blob)

      // Trigger download.
      const a = document.createElement('a')
      a.href = url
      a.download = `imgest-file.${ext}` // TODO: get real filename
      a.click()

      // Delete blob.
      window.URL.revokeObjectURL(url)
    })
  }
}

export default TorrentRenderer
