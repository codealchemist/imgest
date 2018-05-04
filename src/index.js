import LazyLoad from 'vanilla-lazyload'
import El from 'eldo'
import Count from 'components/count'
import torrentLoader from 'components/torrent-loader'
import TorrentRenderer from 'components/torrent-renderer'
import localLoader from 'components/local-loader'
import LocalRenderer from 'components/local-renderer'
import error from 'components/error-message'
import notifier from 'components/notifier'
import loading from 'components/loading'
import Progress from 'components/progress'
import 'material-design-lite'

// Image lazy loading.
const lazy = new LazyLoad({
  elements_selector: '.image-element',
  callback_set: (el) => {
    const image = new El(el)
    image.attr('data-src', false)
  }
})

torrentLoader.autoload()
if (torrentLoader.loading) {
  loading.show()
  const torrentRenderer = new TorrentRenderer()
  torrentRenderer
    .mount('#image-list')
    .onLoading(() => loading.minimize())
    .onDone(() => loading.hide())

  torrentLoader.onTorrent((torrent) => {
    torrentRenderer.render(torrent)
    const progress = new Progress(torrent)
    progress.mount(document.body)
    const count = new Count()
    count
      .mount('#count')
      .render(torrent.files.length)
  })

  torrentLoader.onError((err) => {
    loading.hide()
    error.show(err)
  })
} else {
  const store = localLoader()
  const localRenderer = new LocalRenderer(store)
  localRenderer
    .mount('#image-list')
    .onDone(() => {
      loading.hide()
      lazy.update()
    })
    .render()
}

setTimeout(() => {
  notifier.show({message: 'Rock it!'})
}, 2000)
