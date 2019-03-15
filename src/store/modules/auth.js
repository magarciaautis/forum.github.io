import firebase from 'firebase'

export default {

  namespaced: true,
  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    /* En el getter authUser estamos accediendo a los usuarios en el state, dado que el state dentro
    del modulo nos dara el estado local, necesitamos buscar al usuario en el rootState, el rootState
    es pasado en los getters del modulo como tercer argumento */
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },
  actions: {
    initAuthentication ({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }
        /* Cuando el usuario auntentificado cambia en el firebase, tenemos que asignarlo de nuevo a la variable
        que esta en el store para mantenerlo actualizado y saber en todo momento quien es el usuario actual logueado */
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser))
          } else {
            resolve(null)
          }
        })
        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },
    registerUserWithEmailAndPassword ({dispatch}, {email, name, username, password, avatar = null}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          /* pasamos el id del usuario que se ha creado en la autentificacion de firebase
          y se tiene que poner user.user.id porque firebase ha cambiado la estructura en que
          devuelve el user, y ahora devuelve un objeto user dentro de otro objeto user y luego ya
          tiene las propiedades del usuario */
          /* Aqui tambien debemos pasar un tercer argumento, para iniciar el namespaced desde root,
          si root no esta especificado, vuex buscara por un namespaced anidado bajo el modulo actual,
          que en este caso seria auth/users y luego la accion */
          return dispatch('users/createUser', {id: user.user.uid, email, name, username, password, avatar}, {root: true})
        })
          .then(() => dispatch('fetchAuthUser'))
    },
    signInWithEmailAndPassword (context, {email, password}) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    signInWithGoogle ({dispatch}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          const user = data.user
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) {
              return dispatch('users/createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL}, {root: true})
                .then(() => dispatch('fetchAuthUser'))
            }
          })
        })
    },
    signOut ({commit}) {
      return firebase.auth().signOut()
        .then(() => {
          commit('setAuthId', null)
        })
    },
    // Obtener usuario logueado
    fetchAuthUser ({dispatch, commit}) {
      // Obtenemos el id del usuario logueado
      const userId = firebase.auth().currentUser.uid
      return new Promise((resolve, reject) => {
        // check if user exists in the database
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            /* Llamamos a la funcion fetchUser para que nos devuelva el usuario con todos sus datos pasando el id
            que hemos obtenido con la funcion de firebase */
            return dispatch('users/fetchUser', {id: userId}, {root: true})
            .then(user => {
              // Asignamos en el setAuthId el id del usuario para en todo momento poder acceder a el
              commit('setAuthId', userId)
              resolve(user)
            })
          } else {
            resolve(null)
          }
        })
      })
    }
  },
  mutations: {
    // Asignar el id del usuario logueado a la variable authId del state
    setAuthId (state, id) {
      state.authId = id
    },
    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}
