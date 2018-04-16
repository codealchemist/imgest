import dragDrop from 'drag-drop'
import {compose, createStore} from 'redux'
import persistState from 'redux-localstorage'
import reducer from 'state/reducer'
import Count from 'components/count'
import ImageList from 'components/image-list'
import Notifier from 'components/notifier'
import Actions from 'components/actions'
import El from 'eldo'
import 'material-design-lite'
import './index.css'

const initialState = {
  count: 0,
  images: []
}
const enhancer = compose(persistState())
const store = createStore(reducer, initialState, enhancer)

const notifier = new Notifier()
notifier
  .mount('#notifier')

const count = new Count(store)
count
  .mount('#count')
  .render()

const imageList = new ImageList(store)
imageList
  .mount('#image-list')
  .render()

const actions = new Actions(store)
actions
  .mount('#actions')
  .render()

dragDrop('body', (files, pos) => {
  files = Array.from(files)
  files.forEach((file) => {
    console.log(file)
    const type = file.type || 'image/jpeg'

    // convert the file to a Buffer that we can use!
    var reader = new FileReader()
    reader.addEventListener('load', (e) => {
      const data = e.target.result
      store.dispatch({
        type: 'ADD_IMAGE',
        image: {
          id: file.name,
          name: file.name,
          description: '',
          src: `data:${type};${data}`
        }
      })
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
