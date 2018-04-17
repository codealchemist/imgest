import El from 'eldo'
import './notifier.css'

class Notifier {
  onAction (e) {
    console.log('NOTIFIER action', e)
  }

  show (data) {
    this.$el.get().MaterialSnackbar.showSnackbar(data)
    return this
  }

  mount (el) {
    this.$el = new El(el)
    return this
  }
}

export default Notifier
