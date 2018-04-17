import El from 'eldo'
import './loading.css'

class Loading {
  constructor () {
    this.$el = new El('#loading')
  }

  show () {
    this.$el.appear()
  }

  hide () {
    this.$el.disappear()
  }
}

const loading = new Loading()
export default loading
