import Vue from 'vue'

export default {
  /* setItem se encarga de montar el objeto con los datos que le hemos pasado para guardarlo en el array
  del state correspondiente de este fichero */
  setItem (state, {item, id, resource}) {
    // añade al objeto que hemos pasado su respectiva id a la propiedad .key
    item['.key'] = id
    // la funcion set pide 3 parametros, lugar del state donde se quiere guardar, id , y el objeto
    Vue.set(state[resource].items, id, item)
  }
}
