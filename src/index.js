import Count from 'components/count'
import torrentLoader from 'components/torrent-loader'
import TorrentRenderer from 'components/torrent-renderer'
import localLoader from 'components/local-loader'
import LocalRenderer from 'components/local-renderer'
import error from 'components/error-message'
import notifier from 'components/notifier'
import loading from 'components/loading'
import 'material-design-lite'

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
    .onDone(() => loading.hide())
    .render()
}

setTimeout(() => {
  notifier.show({message: 'Rock it!'})
}, 2000)
