import firebase from 'firebase'
import Vue from 'vue'

export default {

  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    createPost ({commit, state, rootState}, post) {
      /* cuando hacemos un push a la base de datos para guardar un nuevo elemento, genera una key automatica
      que podemos obtener con el .key que sera el identificador del nuevo post */
      const postId = firebase.database().ref('posts').push().key
      post.userId = rootState.auth.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      const updates = {}
      updates[`posts/${postId}`] = post
      updates[`threads/${post.threadId}/posts/${postId}`] = postId
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
      updates[`users/${post.userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates)
        .then(() => {
          commit('setItem', {resource: 'posts', item: post, id: postId}, {root: true})
          commit('threads/appendPostToThread', {threadId: post.threadId, postId}, {root: true})
          commit('threads/appendContributorToThread', {threadId: post.threadId, contributorId: post.userId}, {root: true})
          commit('users/appendPostToUser', {userId: post.userId, postId}, {root: true})
          return Promise.resolve(state.items[postId])
        })
    },
    updatePost ({state, commit, rootState}, {id, text}) {
      return new Promise((resolve, reject) => {
        /* Aqui parece que la variable post contiene el post desactualizado dado que actualizamos su
        texto mas tarde, sin embargo este no es el caso, ya que el post esta establecido a un objeto
        por referencia, asi que cuando la mutacion "setPost" es llamada y actualiza el estado,
        todas las variables que hacen referncia al objeto post se mantienen actualizadas */
        const post = state.items[id]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: rootState.auth.authId
        }
        const updates = {}
        updates['text'] = text
        updates['edited'] = edited
        firebase.database().ref('posts').child(id).update(updates)
          .then(() => {
            commit('setPost', {
              postId: id,
              post: {
                ...post,
                text
              }
            })
            resolve(post)
          })// END .then(() => {
      })
    },
    // Obtener post
    fetchPost ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'posts', id}, {root: true})
    },
    // Obtener varios posts
    fetchPosts ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'posts'}, {root: true})
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      // set post
      Vue.set(state.items, postId, post)
    }
  }
}
