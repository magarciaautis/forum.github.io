<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Editing <i>{{thread.title}}</i></h1>
    <ThreadEditor
      ref="editor"
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    /> 
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: {
    ThreadEditor
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    text () {
      const post = this.$store.state.posts.items[this.thread.firstPostId]
      return post ? post.text : null
    },
    hasUnsavedChanges () {
      return this.$refs.editor.form.title !== this.thread.title || this.$refs.editor.form.text !== this.text
    }
  },
  methods: {
    save ({title, text}) {
      // dispatch action
      this.$store.dispatch('threads/updateThread', {
        id: this.id,
        title,
        text
      }).then(thread => {
        this.$router.push({name: 'ThreadShow', params: {id: this.id}})
      })
    },
    cancel () {
      this.$router.push({name: 'Forum', params: {id: this.$store.state.threads.items[this.id].forumId}})
    }
  },
  created () {
    this.$store.dispatch('threads/fetchThread', {id: this.id})
      .then(thread => this.$store.dispatch('posts/fetchPost', {id: thread.firstPostId}))
        .then(() => { this.asyncDataStatus_fetched() })
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Any unsaved changes will be lost!')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped>

</style>
