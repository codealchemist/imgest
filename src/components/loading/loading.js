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

  minimize () {
    this.$el.addClass('minimized')
  }

  maximize () {
    this.$el.removeClass('minimized')
  }
}

const loading = new Loading()
export default loading
