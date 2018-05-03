import El from 'eldo'
import EditorActions from 'components/editor-actions'
import notifier from 'components/notifier'
import './image-editor.css'

const form = ({image: {id, name, description, type, data}, isOpen, readOnly}) => {
  if (!isOpen) return ''

  return `
    <div id="image-editor" ${!readOnly ? 'class="editable"' : ''}>
      <h1 id="editor-image-name" ${readOnly ? '' : 'contenteditable="true"'}>${name}</h1>
      <div id="editor-image-description" class="description" ${readOnly ? '' : 'contenteditable="true"'}>${description}</div>
      <div class="image-editor-image" style="background-image: url('data:${type};${data}')"></div>
    </div>
  `
}

class ImageEditor {
  constructor (store) {
    this.store = store
    this.state = this.getState()
    this.actions = new EditorActions(store)
    this.initialized = false
    this.saveEnabled = false
    this.initializedSelectors = false

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        this.state = newState
        this.render()
      }
    })
  }

  getState () {
    return this.store.getState().editor
  }

  mount (el) {
    this.$el = new El(el)
    this.actions.mount('#image-editor-actions')
    return this
  }

  render () {
    const html = form(this.state)
    this.$el.html(html)
    this.actions.render()

    if (!this.initialized) this.events()
  }

  initSelectors () {
    this.$name = new El('#editor-image-name')
    this.$description = new El('#editor-image-description')
  }

  events () {
    this.$el.on('keypress', (e) => {
      if (!this.saveEnabled) this.actions.enableSave()
      if (!this.initializedSelectors) this.initSelectors()
    })

    this.actions.onSave(() => {
      this.save()
    })

    this.initialized = true
  }

  save () {
    const id = this.state.image.id
    const name = this.$name.html()
    const description = this.$description.html()
    this.store.dispatch({type: 'UPDATE_IMAGE', id, name, description})
    notifier.show({message: 'Image details saved successfully!'})

    // Update listed image.
    const $name = new El(`#image-${id} .image-name`)
    $name.html(name)
  }
}

export default ImageEditor
