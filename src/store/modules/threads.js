/* countObjectProperties tiene que ir entre corchetes porque esta
dentro del objeto export en el fichero utils/index y de esta manera
solo importaremos la funcion que vamos a utilizar y no todo el fichero */
import {countObjectProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'

export default {

  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    threadRepliesCount (state) {
      return function (id) {
        return countObjectProperties(state.items[id].posts) - 1
      }
    }
  },
  actions: {
    createThread ({commit, state, dispatch, rootState}, {text, title, forumId}) {
      return new Promise((resolve, reject) => {
        /* cuando hacemos un push a la base de datos para guardar un nuevo elemento, genera una key automatica
        que podemos obtener con el .key que sera el identificador del nuevo thread */
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = rootState.auth.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const thread = {
          'title': title,
          'forumId': forumId,
          'publishedAt': publishedAt,
          'userId': userId,
          'firstPostId': postId,
          'posts': {}
        }
        thread.posts[postId] = postId
        const post = {
          'text': text,
          'publishedAt': publishedAt,
          'threadId': threadId,
          'userId': userId
        }
        const updates = {}
        // set thread
        updates[`threads/${threadId}`] = thread
        // append to forum
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        // append to user
        updates[`users/${userId}/threads/${threadId}`] = threadId
        /* Cuando creamos un nuevo thread en la web tambien se crea un post que lo inicia el mismo usuario
        entonces tambien hacemos lo mismo que cuando se crea un nuevo post una vez hemos creado el thread */
        updates[`posts/${postId}`] = post
        updates[`users/${userId}/posts/${postId}`] = postId
        firebase.database().ref().update(updates)
          .then(() => {
            // update thread
            commit('setItem', {resource: 'threads', id: threadId, item: thread}, {root: true})
            commit('forums/appendThreadToForum', {forumId, threadId}, {root: true})
            commit('users/appendThreadToUser', {userId, threadId}, {root: true})
            // Update post
            commit('setItem', {resource: 'posts', item: post, id: postId}, {root: true})
            commit('appendPostToThread', {threadId: post.threadId, postId})
            commit('users/appendPostToUser', {userId: post.userId, postId}, {root: true})
            resolve(state.items[threadId])
          })
      })
    },
    updateThread ({state, commit, dispatch, rootState}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.items[id]
        const post = rootState.posts.items[thread.firstPostId]

        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: rootState.auth.authId
        }

        const updates = {}
        updates[`posts/${thread.firstPostId}/text`] = text
        updates[`posts/${thread.firstPostId}/edited`] = edited
        updates[`threads/${id}/title`] = title

        firebase.database().ref().update(updates)
          .then(() => {
            /* Utilizamos el "spread operator" para clonar el objeto
            que en este caso es el thread y el post, para poder actualizar
            el titulo del thread y el texto del post sin cambiarlo
            inmediantamente mientras estas escribiendo la nueva
            modificacion y que se vaya actualiando en tiempo real */
            /* Hacemos un commit para que las mutaciones correspondientes
            cambien los estados */
            commit('setThread', {thread: {...thread, title}, threadId: id})
            commit('posts/setPost', {postId: thread.firstPostId, post: {...post, text, edited}}, {root: true})
            resolve(post)
          })// END .then(() => {
      })
    },
    // Obtener thread
    fetchThread ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'threads', id}, {root: true})
    },
    // Obtener varios threads
    fetchThreads ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'threads'}, {root: true})
    }
  },
  mutations: {
    setThread (state, {thread, threadId}) {
      // set User
      Vue.set(state.items, threadId, thread)
    },
    // Asignar post al thread
    appendPostToThread (state, {postId, threadId}) {
      const thread = state.items[threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },
    // Asignar contributor al thread
    appendContributorToThread (state, {contributorId, threadId}) {
      const thread = state.items[threadId]
      if (!thread.contributors) {
        Vue.set(thread, 'contributors', {})
      }
      Vue.set(thread.contributors, contributorId, contributorId)
    }
  }
}
