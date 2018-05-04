import './progress.css'
export default class Progress {
  constructor (torrent) {
    this.torrent = torrent
    const template = `<div class="progress-bar-container"><div class="progress-bar"></div></div>`
    const temp = document.createElement('div')
    temp.innerHTML = template
    this.$container = temp.querySelector('.progress-bar-container')
    this.$element = this.$container.querySelector('.progress-bar')
  }

  update () {
    if (this.torrent.progress === 1) {
      this.destroy()
    }
    const progress = !!this.torrent.progress && (this.torrent.progress * 100)
    this.$element.style.width = `${progress || 0}%`
    return this
  }

  stop () {
    clearInterval(this.interval)
  }

  destroy () {
    this.stop()
    this.$container.parentNode.removeChild(this.$container)
  }

  mount (container) {
    container.prepend(this.$container)
    const seconds = 2
    this.interval = setInterval(() => this.update(), seconds * 1000)
    return this
  }
}
