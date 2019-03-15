import firebase from 'firebase'

export default {

  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    fetchAllCategories ({state, commit}) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          // Aqui nos guardamos un objeto que contiene todas las categorias
          const categoriesObject = snapshot.val()
          /* con Object.keys convertimos en un array el objeto categoriesObject
          y vamos iterando cada id para obtener el objeto completo por separado */
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            commit('setItem', {resource: 'categories', id: categoryId, item: category}, {root: true})
          })
          resolve(Object.values(state.items))
        })
      })// END promise
    },
    /* Como estas acciones (fetchItem y fetchItems) son globales y no pertenecen a ningun modulo,
    para despachar o hacer commit de mutaciones en el namespaced global, simplemente pasamos como
    tercer argumento para despachar el commit */
    // Obtener categoria
    fetchCategory ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'categories', id}, {root: true})
    },
    // Obtener varios categorias
    fetchCategories ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'categories'}, {root: true})
    }
  },
  mutations: {}
}
