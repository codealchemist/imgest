import El from 'eldo'
import './count.css'

const count = count => `
  <div class="count-number">${count}</div>
`

class Count {
  constructor (store) {
    if (!store) return
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

  mount (el) {
    this.$el = new El(el)
    return this
  }

  render (value) {
    const html = count(value || this.state)
    this.$el.html(html)
    this.$el.show()
  }
}

export default Count
