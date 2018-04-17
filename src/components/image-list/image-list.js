import El from 'eldo'
import sortable from 'sortablejs'
import image from 'components/image'
import loading from 'components/loading'
import './image-list.css'

const imageList = (images = [], component) => (
  images
    .map((imageState, index) => image({...imageState, index}))
    .join('')
)

class ImageList {
  constructor (store) {
    this.store = store
    this.state = this.getState()

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        this.state = newState
        this.render()
        loading.hide()
      }
    })
  }

  removeImage (e, {id}) {
    e.stopPropagation()

    // Remove image from the Store.
    console.log('REMOVE IMAGE', id)
    this.store.dispatch({type: 'REMOVE_IMAGE', id})
  }

  add (images) {
    this.store.dispatch({type: 'ADD_IMAGE_COLLECTION', images})
  }

  getState () {
    return this.store.getState().images
  }

  events () {
    this.$el.on('click', (e) => {
      e.stopPropagation()
      console.log('IMAGE LIST CLICK', e)
      if (e.target.className.match(/^remove.*$/)) this.removeImage(e, e.target.dataset)
    })
  }

  mount (el) {
    this.$el = new El(el)
    this.events()
    return this
  }

  onSort ({oldIndex, newIndex, item}) {
    const {id} = item.dataset
    this.store.dispatch({type: 'SORT_IMAGE', newIndex, oldIndex})
  }

  render () {
    const html = imageList(this.state, this)
    this.$el.html(html)

    // Create sortable images list.
    sortable.create(this.$el.get(), {
      onSort: (e) => this.onSort(e)
    })
  }
}

export default ImageList
