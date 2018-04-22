import El from 'eldo'
import sortable from 'sortablejs'
import torrentLoader from 'components/torrent-loader'
import image from 'components/torrent-image'
import loading from 'components/loading'
import 'components/image-list/image-list.css'

const imageList = (images = []) => (
  images
    .map((imageState, index) => image({...imageState, index}))
    .join('')
)

class TorrentRenderer {
  mount (el) {
    this.$el = new El(el)
    this.totalFiles = 0
    this.loadedFiles = 0
    return this
  }

  render (torrent) {
    this.totalFiles = torrent.files.length
    torrent.files.forEach((file) => {
      file.id = file.offset
      file.description = ''

      file.getBuffer((err, buffer) => {
        const image = new El(`#image-${file.id} .image-element`)
        image.style('background-image', `url('data:image/jpeg;${buffer}`)
        ++this.loadedFiles

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
}

export default TorrentRenderer
