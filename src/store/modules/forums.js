import Vue from 'vue'

export default {

  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    // Obtener foro
    fetchForum ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'forums', id}, {root: true})
    },
    // Obtener varios forums
    fetchForums ({dispatch}, {ids}) {
      return dispatch('fetchItems', {ids, resource: 'forums'}, {root: true})
    }
  },
  mutations: {
    // Asignar hilo al foro
    appendThreadToForum (state, {forumId, threadId}) {
      const forum = state.items[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    }
  }
}
