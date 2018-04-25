import El from 'eldo'
import './loading.css'

class Loading {
  constructor () {
    this.$el = new El('#loading')
  }

  show () {
    this.$el.appear()
    return this
  }

  hide () {
    this.$el.disappear()
    return this
  }

  minimize () {
    this.$el.addClass('minimized')
    return this
  }

  maximize () {
    this.$el.removeClass('minimized')
    return this
  }

  torrent () {
    this.$el.addClass('torrent')

    return {
      show: () => {
        this.show()
      },
      hide: () => {
        this.hide()
        this.$el.removeClass('torrent')
      }
    }
  }
}

const loading = new Loading()
export default loading
