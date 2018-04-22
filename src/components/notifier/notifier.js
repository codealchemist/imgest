import El from 'eldo'
import './notifier.css'

class Notifier {
  show (data) {
    this.$el.get().MaterialSnackbar.showSnackbar(data)
    return this
  }

  mount (el) {
    this.$el = new El(el)
    return this
  }
}

const notifier = new Notifier()
notifier.mount('#notifier')

export default notifier
