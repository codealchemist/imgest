import El from 'eldo'
import './add-image-form.css'

const addImageForm = () => (`
  <form>
    <div class="mdl-textfield mdl-js-textfield">
      <input class="mdl-textfield__input" type="text" id="image-name">
      <label class="mdl-textfield__label" for="image-name">Name</label>
    </div>
  </form>
`)

class AddImageForm {
  constructor (store) {
    this.store = store
  }

  events () {
    this.el.on('click', () => {
      console.log('ADD-IMAGE-FORM click')
    })
  }

  mount (el) {
    this.el = new El(el)
    return this
  }

  render () {
    const html = addImageForm()
    this.el.html(html)
  }
}

export default AddImageForm
