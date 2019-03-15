<template>
  <div v-if="asyncDataStatus_ready" class="flex-grid">
    <UserProfileCard
      v-if="!edit"
      :user="user"
    />
    <UserProfileCardEditor
      v-else
      :user="user"
    />
    <div class="col-7 push-top width816">
      <div class="profile-header">
        <span class="text-lead">
            {{user.username}}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>
      
      <hr>
      <div v-if="this.user.posts">
        <PostList 
          :posts="userPosts"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import {mapGetters} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  mixins: [asyncDataStatus],
  props: {
    edit: {
      type: Boolean,
      /* Esta variable se pone a false por defecto para que cada vez
      que se entra por primera vez a esta pagina este a false o si esta
      a true en algun momento, cuando se salga se pone otra vez a false */
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    }),
    userPosts () {
      return this.$store.getters['users/userPosts'](this.user['.key'])
    }
  },
  created () {
    if (this.user.posts) {
      this.$store.dispatch('posts/fetchPosts', {ids: this.user.posts})
        .then(posts => {
          const threadsIds = posts.map(post => post.threadId)
          const diferentsThreads = [...new Set(threadsIds)]
          this.$store.dispatch('threads/fetchThreads', {ids: diferentsThreads})
            .then(() => this.asyncDataStatus_fetched())
        })
    } else {
      this.asyncDataStatus_fetched()
    }
  }
}
</script>

<style scoped>

</style>
