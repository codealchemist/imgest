import El from 'eldo'
import selectors from 'components/selectors'
import './actions.css'

const actions = count => `
  <div id="clear-action" class="reset ${count? '' : 'disabled'}">
    <div class="action-icon no-events">
      <i class="material-icons">clear</i>
    </div>
  </div>
`

class Actions {
  constructor (store) {
    this.store = store
    this.state = this.getState()

    store.subscribe(() => {
      const newState = this.getState()
      if (newState !== this.state) {
        this.state = newState
        this.render()
      }
    })
  }

  getState () {
    return this.store.getState().count
  }

  clear () {
    if (!this.state) return
    if (!confirm('Are you sure you want to remove ALL images?')) return
    selectors.$imageList.html('')
    this.store.dispatch({type: 'CLEAR'})
  }

  events () {
    this.$el.on('click', (e) => {
      if (e.target.id === 'clear-action') return this.clear()
    })
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
}

export default Actions
