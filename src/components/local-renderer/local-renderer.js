import dragDrop from 'drag-drop'
import ImageList from 'components/image-list'
import Actions from 'components/actions'
import loading from 'components/loading'

class LocalRenderer {
  constructor (store) {
    this.store = store
    this.imageList = new ImageList(store)
  }

  mount (el) {
    this.imageList.mount(el)
    return this
  }

  setDragAndDrop () {
    dragDrop('body', (files, pos) => {
      loading.show()
      const count = files.length
      const images = []
      files = Array.from(files)
      files.forEach((file, index) => {
        // TODO: validate types
        const type = file.type || 'image/jpeg'

        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
          const data = e.target.result
          images.push({
            id: `${index}-${(new Date()).getTime()}`,
            name: file.name,
            description: '',
            type,
            data
          })

          if (count === images.length) {
            this.imageList.add(images)
          }
        })
        reader.addEventListener('error', (err) => {
          console.error('FileReader error' + err)
        })
        reader.readAsDataURL(file)
      })
    })
  }

  renderActions () {
    const actions = new Actions(this.store)
    actions
      .mount('#actions')
      .render()
  }

  render () {
    this.renderActions()
    this.setDragAndDrop()
    this.imageList
      .onDone(this.onDoneCallback)
      .render()
  }

  onDone (callback) {
    this.onDoneCallback = callback
    return this
  }
}

export default LocalRenderer
