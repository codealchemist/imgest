import El from 'eldo'
import sortable from 'sortablejs'
import image from 'components/image'
import './image-list.css'

const imageList = (images = []) => (
  images
    .map((imageState, index) => image({...imageState, index}))
    .join('')
)

class ImageList {
  constructor (store) {
    this.store = store
    this.state = this.getState()
    this.initialized = false

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        if (typeof this.onDoneCallback === 'function') {
          this.onDoneCallback()
        }

        if (!this.initialized) {
          // Defer rendering.
          setTimeout(() => {
            this.render()
          })
        }

        this.state = newState
        this.initialized = true
      }
    })
  }

  didCountChange (newState) {
    const newCount = newState.length
    const count = this.state.length
    return (newCount !== count)
  }

  remove (e, {id}) {
    e.stopPropagation()

    // Remove image from the DOM.
    const $image = new El(`#image-${id}`)
    $image.remove()

    // Remove image from the Store.
    this.store.dispatch({type: 'REMOVE_IMAGE', id})
  }

  edit (e, {id}) {
    const image = this.state
      .filter(image => {
        if (image.id === id) return image
      })[0]

    this.store.dispatch({type: 'OPEN_IMAGE_EDITOR', image: { ...image }})
  }

  add (images) {
    this.store.dispatch({type: 'ADD_IMAGE_COLLECTION', images})

    // Render new images.
    if (this.initialized) {
      this.$el.appendHtml(imageList(images))

      setTimeout(() => {
        this.loadImages()
      })
    }
  }

  getState () {
    return this.store.getState().images
  }

  events () {
    this.$el.on('click', (e) => {
      e.stopPropagation()
      // console.log('IMAGE LIST CLICK', e)
      if (e.target.className.match(/^remove.*$/)) this.remove(e, e.target.dataset)
      if (e.target.className.match(/^edit.*$/)) this.edit(e, e.target.dataset)
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
    const html = imageList(this.state)
    this.$el.html(html)
    setTimeout(() => {
      this.loadImages()
    }, 100)

    // Create sortable images list.
    sortable.create(this.$el.get(), {
      onSort: (e) => this.onSort(e)
    })
  }

  loadImages (images) {
    images = images || Array.from(document.querySelectorAll('.image.pending .image-element'))
    images
      .splice(0, 3)
      .forEach((image) => {
        const $image = new El(image)
        const style = $image.attr('data-style')
        if (!style) return

        $image
          .attr('style', style)
          .attr('data-style', false)
          .removeClass('pending')
      })

    if (!images.length) return
    setTimeout(() => {
      this.loadImages(images)
    }, 100)
  }

  onDone (callback) {
    this.onDoneCallback = callback
    return this
  }
}

export default ImageList
