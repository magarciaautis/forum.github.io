import firebase from 'firebase'

export default {
  /* Al fetchItem se le pasa por parametros un resource que en este caso sera el nombre ed la tabla
  de la base de datos a la que se va a hacer referencia y un id para obtener el objeto de esa tabla */
  fetchItem ({state, commit}, {resource, id}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        /* le pasamos al setItem resource="tabla de la base de datos", id="la key del objeto que hemos
        obtenido de la base de datos",  item="el objeto con todos los datos" y este setitem se encargara
        de guardar en el array correspondiente este objeto montado */
        commit('setItem', {
          resource,
          id: snapshot.key,
          item: snapshot.val()
        })
        /* Esto equivaldria por ejemplo a = state.threads[-KsjWehQ--apjDBwSBCY] para obtener el objeto y eso es lo
        que devolveremos */
        resolve(state[resource].items[id])
      })
    })// END promise
  }, // END fetchUser
  /* Esta funcion le pasaremos un array de ids, la tabla a la que va a hacer referencia (resource), y se
  encargara de devolvernos un array con el objeto completo, por ejemplo: le paso un array de ids de posts
  y me va a devolver un array con todos los posts de los ids que le he pasado con todas sus propiedades */
  fetchItems ({dispatch}, {ids, resource}) {
    /* comprobamos si ids es un array, si lo es no hacemos nada, en caso que no lo sea convertimos el
    objecto en un array con Object.keys() */
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    /* Promise.all recibe un array y retorna una sola promesa, que resuelve cuando todas las promesas
    del array han sido resueltas, si una de las promesas falla, entonces Promise.all tambien falla,
    devolviendo el error de la primera promesa que ha fallado, cuando resuelve, recopila todos los
    valores retornados desde las promesas en un array */
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource})))
  }
}
