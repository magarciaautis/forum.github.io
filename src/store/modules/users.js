/* countObjectProperties tiene que ir entre corchetes porque esta
dentro del objeto export en el fichero utils/index y de esta manera
solo importaremos la funcion que vamos a utilizar y no todo el fichero */
import {countObjectProperties, removeEmptyProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'

export default {

  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    userPosts: (state, getters, rootState) => id => {
      const user = state.items[id]
      /* comprobamos si el usuario tiene posts, en caso que los tenga se hara un filtrado para
      obtener todos los post de ese usuario y devolvera un array con todos los posts que se pasaran
      a "PostList" para que los renderize y los muestre */
      if (user.posts) {
        return Object.values(rootState.posts.items)
          .filter(post => post.userId === id)
      }
      return []
    },
    userThreadsCount (state) {
      return function (id) {
        return countObjectProperties(state.items[id].threads)
      }
    },
    userPostsCount (state) {
      return function (id) {
        return countObjectProperties(state.items[id].posts)
      }
    }
  },
  actions: {
    createUser ({state, commit}, {id, email, name, username, avatar = null}) {
      return new Promise((resolve, reject) => {
        const registerAt = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = {avatar, email, name, username, usernameLower, registerAt}
        firebase.database().ref('users').child(id).set(user)
          .then(() => {
            commit('setItem', {resource: 'users', id: id, item: user}, {root: true})
            resolve(state.items[id])
          })
      })
    },
    updateUser ({commit}, user) {
      const updates = {
        avatar: user.avatar,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        email: user.email,
        location: user.location
      }
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
          .then(() => {
            commit('setUser', {userId: user['.key'], user})
            resolve(user)
          })
      })
    },
    // Obtener usuario
    fetchUser ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'users', id}, {root: true})
    },
    // Obtener varios usuarios
    fetchUsers ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'users'}, {root: true})
    }
  },
  mutations: {
    setUser (state, {user, userId}) {
      // set User
      Vue.set(state.items, userId, user)
    },
    // Asignar post al usuario
    appendPostToUser (state, {postId, userId}) {
      const user = state.items[userId]
      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }
      Vue.set(user.posts, postId, postId)
    },
    // Asignar hilo al usuario
    appendThreadToUser (state, {userId, threadId}) {
      const user = state.items[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    }
  }
}
