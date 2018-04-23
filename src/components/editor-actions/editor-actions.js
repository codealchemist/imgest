import El from 'eldo'
import './editor-actions.css'

const actions = ({isOpen}) => {
  if (!isOpen) return ''

  return `
    <div id="cancel-action" class="btn-action">
      <div class="action-icon no-events">
        <i class="material-icons">clear</i>
      </div>
    </div>

    <div id="save-action" class="btn-action disabled">
      <div class="action-icon no-events">
        <i class="material-icons">done</i>
      </div>
    </div>
  `
}

class EditorActions {
  constructor (store) {
    this.store = store
    this.state = this.getState()
    this.$save = null
    this.$body = new El('body')

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

  events () {
    this.$el.on('click', (e) => {
      if (e.target.id === 'cancel-action') return this.cancel()
      if (e.target.id === 'save-action') return this.save()
    })

    this.$body.on('keydown', (e) => {
      if (e.keyCode === 27) this.cancel()
    })
  }

  cancel () {
    this.store.dispatch({type: 'CLOSE_IMAGE_EDITOR'})
  }

  save () {
    if (typeof this.onSaveCallback === 'function') {
      this.onSaveCallback()
    }
  }

  mount (el) {
    this.$el = new El(el)
    this.events()
    return this
  }

  render () {
    const html = actions(this.state)
    this.$el.html(html)
  }

  enableSave () {
    this.$save = new El('#save-action')
    this.$save.removeClass('disabled')
  }

  onSave (callback) {
    this.onSaveCallback = callback
  }
}

export default EditorActions
