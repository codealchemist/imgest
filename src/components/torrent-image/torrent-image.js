import 'components/image/image.css'

const image = ({id, name, description, type, data}) => (`
  <div id="image-${id}" class="image pending" data-id="${id}">
    <div class="image-name ellipsis">${name}</div>
    <div class="image-description">${description}</div>
    <div class="image-element"></div>

    <div class="image-buttons">
      <button data-id="${id}" class="view mdl-button mdl-button--fab mdl-button--mini-fab">
        <i class="material-icons mdl-color-text--white">remove_red_eye</i>
      </button>
    </div>
  </div>
`)

export default image
