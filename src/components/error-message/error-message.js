import El from 'eldo'
import './error-message.css'

class ErrorMessage {
  show (message) {
    this.$container.appear()
    this.$message.html(message)
    return this
  }

  hide () {
    this.$container.disappear()
    this.$message.html('')
  }

  mount (container, message) {
    this.$container = new El(container)
    this.$message = new El(message)
    return this
  }
}

const errorMessage = new ErrorMessage()
errorMessage.mount('#error', '#error .error-message')

export default errorMessage
