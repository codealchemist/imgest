import dragDrop from 'drag-drop'
import {compose, createStore} from 'redux'
import replicate from 'redux-replicate';
import replicator from 'redux-replicate-localforage';
import localforage from 'localforage'
import reducer from 'state/reducer'
import Count from 'components/count'
import loading from 'components/loading'
import initialState from 'state/initial.json'

function load () {
  const replication = replicate({ key: 'imgest', reducerKeys: true, replicator })
  const create = compose(replication)(createStore);
  const store = create(reducer, initialState)

  // Get data count ASAP to display loading.
  localforage.config({
    name: 'data'
  })
  localforage.getItem('imgest/count', (err, value) => {
    if (err) return console.error('ERR getting images/count:', err)
    if (value > 0) loading.show()

    const count = new Count(store)
    count
      .mount('#count')
      .render(value)
  })

  return store
}

export default load
