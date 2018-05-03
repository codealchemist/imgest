import dragDrop from 'drag-drop'
import ImageList from 'components/image-list'
import Actions from 'components/actions'
import loading from 'components/loading'
import ImageEditor from '../image-editor/image-editor'

class LocalRenderer {
  constructor (store) {
    this.store = store
    this.imageList = new ImageList(store)
    this.editor = new ImageEditor(store)
    this.actions = new Actions(store)
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

        const reader = new window.FileReader()
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

  mount (el) {
    this.imageList.mount(el)
    this.editor.mount('#image-editor-container')
    this.actions.mount('#actions')
    return this
  }

  render () {
    this.actions.render()
    this.editor.render()
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
