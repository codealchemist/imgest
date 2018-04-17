import dragDrop from 'drag-drop'
import {compose, createStore} from 'redux'
import replicate from 'redux-replicate';
import replicator from 'redux-replicate-localforage';
import localforage from 'localforage'
import reducer from 'state/reducer'
import Count from 'components/count'
import ImageList from 'components/image-list'
import Notifier from 'components/notifier'
import Actions from 'components/actions'
import loading from 'components/loading'
import El from 'eldo'
import 'material-design-lite'

const initialState = {
  count: 0,
  images: []
}
const replication = replicate({ key: 'imgest', reducerKeys: true, replicator })
const create = compose(replication)(createStore);
const store = create(reducer, initialState)

// Get data count ASAP to display loading.
localforage.config({
  name: 'data'
})
localforage.getItem('imgest/count', (err, value) => {
  if (err) return console.error('ERR getting images/count:', err)
  if (value === 0) return

  loading.show()

  const count = new Count(store)
  count
    .mount('#count')
    .render(value)
})

const notifier = new Notifier()
notifier
  .mount('#notifier')

const imageList = new ImageList(store)
imageList
  .mount('#image-list')
  .render()

const actions = new Actions(store)
actions
  .mount('#actions')
  .render()

dragDrop('body', (files, pos) => {
  loading.show()
  const count = files.length
  const images = []
  files = Array.from(files)
  files.forEach((file) => {
    // TODO: validate types
    const type = file.type || 'image/jpeg'

    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      const data = e.target.result
      images.push({
        id: file.name,
        name: file.name,
        description: '',
        src: `data:${type};${data}`
      })

      if (count === images.length) {
        imageList.add(images)
      }
    })
    reader.addEventListener('error', (err) => {
      console.error('FileReader error' + err)
    })
    reader.readAsDataURL(file)
  })
})

setTimeout(() => {
  notifier.show({message: 'Rock it!'})
}, 2000)
