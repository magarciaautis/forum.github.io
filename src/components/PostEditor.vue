<template>
    
  <form @submit.prevent="save">

    <div class="form-froup">

      <textarea 
        v-model="form.text"
        @blur="$v.form.text.$touch()" 
        name="" 
        id="" 
        cols="30" 
        rows="10" 
        class="form-input"
        >
      </textarea>
      <template v-if="$v.form.text.$error">
        <span v-if="!$v.form.text.required" class="form-error">Post must have some content</span>
      </template>
    </div>

    <div class="form-actions">
      <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{isUpdate ? 'Update' : 'Submit post'}}</button>

    </div>

  </form>

</template>

<script>
import {required} from 'vuelidate/lib/validators'
export default {
  props: {
    threadId: {
      required: false
    },
    post: {
      type: Object,
      /* comprobamos que el objeto post que le hemos pasado contiene
      los atributos key y text del tipo string, en caso contrario se
      mostrara un error por consola */
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string'
        const textIsValid = typeof obj.text === 'string'
        const valid = keyIsValid && textIsValid
        if (!textIsValid) {
          console.error('The post prop object must include a `.text` attribute.')
        }
        if (!keyIsValid) {
          console.error('The post prop object must include a `.key` attribute.')
        }
        return valid
      }
    },
    editando: {
      type: String
    }
  },
  data () {
    return {
      /* si a este componente "PostEditor.vue" se le esta pasando una
      variable "post" entonces mostrara el formulario con su texto
      correspondiente de ese post, si no, mostrara el formulario vacio
      */
      text: this.post ? this.post.text : '',
      form: {
        text: this.text
      }
    }
  },
  validations: {
    form: {
      text: {
        required
      }
    }
  },
  computed: {
    isUpdate () {
    /* Este computed comprueba si se esta pasando al componente
    una variable post (la doble exclamacion es para convertir
    el this.post en un booleano para saber si existe esa variable o no)
    en caso de que se este pasando la variable, quiere decir
    que estamos editando un post y retornara un true de lo contrario
    retornara un false que se utilizara para el metodo save */
      return !!this.post
    }
  },
  methods: {
    save () {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.persist()
          .then(post => {
            /* una vez tenemos el objeto post montado con los datos
            para crear o actualizar el post, tenemos que darle señal al
            componente padre,para que puede alternar entre mostrar y
            editar el post, para eso hacemos el $emit para accionar un
            metodo de los que se le han pasado desde PostListItem
            que se encarga de poner la variable editing false */
            this.$emit('save', {post})
            /* hacemos reset del form una vez enviado para que no este activada la funcion $touch() y no
            salga el mensaje de "Post must have some content" cuando se comprueba si es valido el
            formulario */
            this.$v.form.$reset()
          })
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    create () {
      const post = {
        text: this.form.text,
        threadId: this.threadId
      }
      this.form.text = ''
      return this.$store.dispatch('posts/createPost', post)
    },
    update () {
      const payload = {
        id: this.post['.key'],
        text: this.form.text
      }
      return this.$store.dispatch('posts/updatePost', payload)
    },
    persist () {
      // este metodo siempre retorna una promesa
      return this.isUpdate ? this.update() : this.create()
    }
  },
  created () {
    /* comprobamos si cuando se entra en modo edicion de un post si existe un post que le estemos pasando
    para coger el texto que tenia y asignarselo al modo edicion para poder editar lo que tenia ese post,
    esta comprobacion se hace porque cuando estas dentro de un hilo viendo los posts, abajo del todo
    esta la opcion de añadir un nuevo post al hilo y para que no de error se comprueba si se le esta pasando
    un post o no para que no se le asigne un texto que no existe */
    if (this.post) {
      this.form.text = this.post.text
    }
  }
}
</script>

<style scoped>

</style>
