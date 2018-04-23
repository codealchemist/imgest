const actions = {
  'ADD_IMAGE': (state, action) => ({
    ...state,
    images: state.images.concat([action.image]),
    count: state.count + 1
  }),
  'REMOVE_IMAGE': (state, action) => ({
    ...state,
    images: state.images.reduce(
      (images, image) => {
        if (image.id !== action.id) images.push(image)
        return images
      },
      []
    ),
    count: state.count - 1
  }),
  'UPDATE_IMAGE': (state, action) => ({
    ...state,
    images: state.images.reduce(
      (images, image) => {
        if (image.id !== action.id) {
          images.push(image)
          return images
        }

        // Found image to edit.
        image.name = action.name
        image.description = action.description
        images.push(image)
        return images
      },
      []
    ),
    editor: {
      ...state.editor,
      isOpen: false
    }
  }),
  'OPEN_IMAGE_EDITOR': (state, action) => ({
    ...state,
    editor: {
      image: { ...action.image },
      isOpen: true,
      readOnly: action.readOnly || false
    }
  }),
  'CLOSE_IMAGE_EDITOR': (state, action) => ({
    ...state,
    editor: {
      ...state.editor,
      image: {},
      isOpen: false,
    }
  }),
  'SORT_IMAGE': (state, {newIndex, oldIndex}) => {
    const images = [].concat(state.images)
    const image1 = state.images[oldIndex]
    const image2 = state.images[newIndex]
    const lastIndex = state.count - 1

    // Move to new index.
    let moveIndex = newIndex
    if (newIndex > oldIndex) moveIndex = newIndex + 1
    images.splice(moveIndex, 0, image1)

    // Remove old index.
    let removeIndex = oldIndex
    if (newIndex < oldIndex) removeIndex = oldIndex + 1
    images.splice(removeIndex, 1)

    return {
      ...state,
      images
    }
  },
  'ADD_IMAGE_COLLECTION': (state, action) => ({
    ...state,
    images: state.images.concat(action.images),
    count: state.count + action.images.length
  }),
  'CLEAR': (state, action) => ({
    images: [],
    count: 0
  }),
}

function reducer (state, action) {
  if (!(action.type in actions)) return state
  return actions[action.type](state, action)
}

export default reducer
