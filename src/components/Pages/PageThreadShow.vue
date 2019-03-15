<template>

    <div v-if="asyncDataStatus_ready" class="col-large push-top">

      <h1>{{thread.title}}</h1>
      <router-link 
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      > 
        Edit Thread 
      </router-link>
      <p>
        By <a href="#" class="link-unstyle">{{user.name}}</a>, <AppDate :timestamp="thread.publishedAt"/>
        <span style="float:right; margin-top: 2px" class="hide-mobile text-fadded text-small">{{repliesCount}} replies by {{contributorsCount}} contributors</span>
      </p>
      <PostList 
        :posts="posts"
      />
      <PostEditor v-if="authUser"
        :threadId="id"
      />
      <div v-else class="text-center" style="margin-bottom: 50px;">
        <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign in </router-link>or
        <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
      </div>

    </div>
    
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import {countObjectProperties} from '@/utils/index'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { mapGetters } from 'vuex'

export default {
  components: {
    PostList,
    PostEditor
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      types: String
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'auth/authUser'
    }),
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key'])
    },
    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    },
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(this.$store.state.posts.items)
      .filter(post => postIds.includes(post['.key']))
    },
    user () {
      return this.$store.state.users.items[this.thread.userId]
    }
  },
  created () {
    // Obtener Hilo
    this.$store.dispatch('threads/fetchThread', {id: this.id})
      .then(thread => {
        // Obtener Usuario
        this.$store.dispatch('users/fetchUser', {id: thread.userId})
        // Obtener array de posts
        return this.$store.dispatch('posts/fetchPosts', {ids: Object.keys(thread.posts)})
      })// END .then(thread
          .then(posts => {
            // Iteramos cada post
            return Promise.all(posts.map(post =>
              // Obtenemos el usuario de cada post
              this.$store.dispatch('users/fetchUser', {id: post.userId})
            ))
          })// END .then(posts
            .then(() => { this.asyncDataStatus_fetched() })
  }
}
</script>
