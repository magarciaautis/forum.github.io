<template>
    
    <div class="post">

          <div class="user-info">
          
            <a href="#" class="user-name">{{user.name}}</a>

            <a href="#">
              <div v-if="user.avatar">
                <img class="avatar-large" :src="user.avatar" alt="" >
              </div>
              <div v-else>
                <img class="avatar-large" src="../assets/img/perfil_post.jpg" alt="">
              </div>
            </a>

            <p class="desktop-only text-small">{{userThreadsCount}} {{userThreadsCount === 1 ? 'thread' : 'threads'}}</p>
            <p class="desktop-only text-small">{{userPostsCount}} {{userPostsCount === 1 ? 'post' : 'posts'}}</p>

          </div>

          <div class="post-content">
            <!-- Si existe la variable editing quiere decir que estamos
            editando el post y pasaremos a renderizarlo con PostEditor
            para editar el texto de dicho post, si no existe la variable
            mostrara el post con el texto que le corresponde -->
            <template v-if="!editing">
              
              <div>

                {{post.text}}

              </div>
              <!-- En caso de que exista un usuario logueado, se mostrara el lapiz para editar el post -->
              <div v-if="authUser">
                <!-- Cuando se hace click en el enlance que en este caso es un lapiz para editar el post
                la variable editing cambia a true de este post y el PostEditor lo renderiza nuevamente
                pero en modo edicion -->
                <a @click.prevent="editing = true" href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change"><i class="fa fa-pencil"></i></a>
              </div>
            </template>
            <div v-else>
              <!-- el save y cancel que se le pasa al PostEditor son metodos que dentro de ese vue
              se pueden utilizar utilizando el this.$emit y lo que haran sera cambiar el valor de la 
              variable editing de ese post -->
              <PostEditor
                :post="post"
                @save="editing = false"
                @cancel="editing = false"
              />

            </div>

          </div>

          <div class="post-date text-faded">
            <div v-if="post.edited" class="edition-info">edited</div>
            <AppDate :timestamp="post.publishedAt"/>
            
          </div>
          <div>
            <router-link :to="{name: 'ThreadShow', params: {id: post.threadId}}">{{showThreadTitle}}</router-link>
          </div>
        </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PostEditor from './PostEditor'
export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  components: {
    PostEditor
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'auth/authUser'
    }),
    user () {
      return this.$store.state.users.items[this.post.userId]
    },
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.post.userId)
    },
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.post.userId)
    },
    showThreadTitle () {
      return this.$store.state.threads.items[this.post.threadId].title
    }
  },
  methods: {
    ...mapActions({
      fetchThread: 'threads/fetchThread'
    })
  }
}
</script>

<style scoped>

</style>
