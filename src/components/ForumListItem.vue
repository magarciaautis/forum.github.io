<template>

  <div class="forum-listing">
  
    <div class="forum-details">
    
      <router-link
        class="text-xlarge"
        :to="{name: 'Forum', params: {id: forum['.key']}}"
      >
      {{forum.name}}
      </router-link>

      <p>Ask your questions and drop your feedback</p>

    </div>

    <div class="threads-count">
    
      <p class="count">{{threadsCount}}</p>
      <!-- if ternario, si hay mas de 1 hilo lo pondra en plural sino en singular -->
      {{threadsCount === 1 ? 'thread' : 'threads'}}
    
    </div>

    <div class="last-thread">
    
    </div>

  </div>
    
</template>

<script>
/* countObjectProperties tiene que ir entre corchetes porque esta
dentro del objeto export en el fichero utils/index y de esta manera
solo importaremos la funcion que vamos a utilizar y no todo el fichero */
import {countObjectProperties} from '@/utils/index'
export default {
  props: {
    forum: {
      required: true,
      type: Object
    }

  },
  computed: {
    threadsCount () {
      return countObjectProperties(this.forum.threads)
    }
  }
}
</script>

<style scoped>
    
</style>