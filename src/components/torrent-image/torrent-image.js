import 'components/image/image.css'

const image = ({id, name, description, type, data}) => (`
  <div id="image-${id}" class="image pending" data-id="${id}">
    <div class="image-name ellipsis">${name}</div>
    <div class="image-description">${description}</div>
    <div class="image-element" data-style="background-image: url('data:${type};${data}')"></div>
  </div>
`)

export default image
